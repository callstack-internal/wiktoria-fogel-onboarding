package com.weatherapp

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.os.Looper
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule

@ReactModule(name = LocationModule.NAME)
class LocationModule(private val context: ReactApplicationContext) : NativeLocationSpec(context) {

	companion object {
		const val NAME = "Location"
	}

	private val locationManager: LocationManager = context.getSystemService(LocationManager::class.java)
	private val listeners: MutableMap<Int, LocationListener> = mutableMapOf()
	private var nextWatchId: Int = 1

	override fun getName(): String = NAME

	override fun addListener(eventName: String) {
		// No-op. Required for RN event emitter semantics.
	}

	override fun removeListeners(count: Double) {
		// No-op.
	}

	override fun requestAuthorization(whenInUse: Boolean, promise: Promise) {
		val fineGranted = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
		val coarseGranted = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
		promise.resolve(fineGranted || coarseGranted)
	}

	override fun getCurrentPosition(timeoutMs: Double?, promise: Promise) {
		if (!hasLocationPermission()) {
			promise.reject("E_LOCATION_PERMISSION", "Location permission not granted")
			return
		}

		try {
			val provider = chooseProvider()
			val last = locationManager.getLastKnownLocation(provider)
			if (last != null) {
				promise.resolve(locationToMap(last))
				return
			}

			val listener = object : LocationListener {
				override fun onLocationChanged(location: Location) {
					locationManager.removeUpdates(this)
					promise.resolve(locationToMap(location))
				}

				override fun onProviderEnabled(provider: String) {}
				override fun onProviderDisabled(provider: String) {}

				@Suppress("DEPRECATION")
				override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
			}
			locationManager.requestSingleUpdate(provider, listener, Looper.getMainLooper())
		} catch (t: Throwable) {
			promise.reject("E_LOCATION_UNAVAILABLE", t)
		}
	}

	override fun watchPosition(options: ReadableMap?): Double {
		if (!hasLocationPermission()) {
			return -1.0
		}

		val intervalMs = if (options != null && options.hasKey("intervalMs") && !options.isNull("intervalMs")) {
			options.getDouble("intervalMs").toLong()
		} else 10000L

		val provider = chooseProvider()
		val id = nextWatchId++
		val listener = object : LocationListener {
			override fun onLocationChanged(location: Location) {
				sendEvent("locationUpdated", locationToMap(location))
			}

			override fun onProviderEnabled(provider: String) {}
			override fun onProviderDisabled(provider: String) {}

			@Suppress("DEPRECATION")
			override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
		}

		listeners[id] = listener
		locationManager.requestLocationUpdates(provider, intervalMs, 0f, listener, Looper.getMainLooper())
		return id.toDouble()
	}

	override fun clearWatch(watchId: Double) {
		val id = watchId.toInt()
		listeners.remove(id)?.let { l ->
			locationManager.removeUpdates(l)
		}
	}

	private fun hasLocationPermission(): Boolean {
		val fineGranted = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
		val coarseGranted = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
		return fineGranted || coarseGranted
	}

	private fun chooseProvider(): String {
		return if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
			LocationManager.GPS_PROVIDER
		} else {
			LocationManager.NETWORK_PROVIDER
		}
	}

	private fun locationToMap(location: Location): WritableMap {
		val map = Arguments.createMap()
		val coords = Arguments.createMap()
		coords.putDouble("latitude", location.latitude)
		coords.putDouble("longitude", location.longitude)
		coords.putDouble("accuracy", location.accuracy.toDouble())
		if (location.hasAltitude()) coords.putDouble("altitude", location.altitude)
		if (location.hasSpeed()) coords.putDouble("speed", location.speed.toDouble())
		if (location.hasBearing()) coords.putDouble("heading", location.bearing.toDouble())
		map.putMap("coords", coords)
		map.putDouble("timestamp", location.time.toDouble())
		return map
	}

	private fun sendEvent(eventName: String, params: WritableMap) {
		context
			.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
			.emit(eventName, params)
	}
}

