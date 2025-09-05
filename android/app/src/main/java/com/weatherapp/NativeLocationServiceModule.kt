package com.weatherapp

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.os.Looper
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.google.android.gms.location.*

class NativeLocationServiceModule(
    reactContext: ReactApplicationContext
) : NativeLocationServiceSpec(reactContext) {

    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(reactContext)

    override fun getName(): String = "NativeLocationService"

    override fun getCurrentLocationDetails(promise: Promise) {
        val currentActivity = currentActivity ?: run {
            promise.reject("NO_ACTIVITY", "No activity available")
            return
        }

        if (ActivityCompat.checkSelfPermission(
                reactApplicationContext,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                currentActivity,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                1000
            )
            promise.reject("PERMISSIONS_NOT_GRANTED", "Location permissions not granted")
            return
        }

        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY, 1000
        ).setMinUpdateIntervalMillis(500)
            .setMaxUpdates(1)
            .build()

        val locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                fusedLocationClient.removeLocationUpdates(this)
                val location: Location? = locationResult.lastLocation
                if (location != null) {
                    val result = mapOf(
                        "latitude" to location.latitude,
                        "longitude" to location.longitude,
                        "altitude" to location.altitude,
                        "horizontalAccuracy" to location.accuracy,
                        "verticalAccuracy" to if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)
                            location.verticalAccuracyMeters else 0f,
                        "timestamp" to location.time.toString()
                    )
                    promise.resolve(result)
                } else {
                    promise.reject("LOCATION_ERROR", "Failed to get location")
                }
            }
        }

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        } catch (e: Exception) {
            promise.reject("LOCATION_ERROR", "Failed to request location updates", e)
        }
    }

    companion object {
        const val NAME = "NativeLocationService"
    }
}
