package com.weatherapp

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.os.Looper
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*
import com.google.android.gms.location.*
import org.json.JSONObject

class NativeLocationServiceModule(reactContext: ReactApplicationContext) :
    NativeLocationServiceSpec(reactContext) {

    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(reactContext)

    override fun getName(): String = NAME

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

        val locationRequest = LocationRequest.create().apply {
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
            interval = 1000
            fastestInterval = 500
            numUpdates = 1
        }

        val locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                fusedLocationClient.removeLocationUpdates(this)

                val location: Location? = locationResult.lastLocation
                if (location != null) {
                    try {
                        val locationJson = JSONObject().apply {
                            put("latitude", location.latitude)
                            put("longitude", location.longitude)
                            put("altitude", location.altitude)
                            put("horizontalAccuracy", location.accuracy)
                            put("verticalAccuracy", if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)
                                location.verticalAccuracyMeters else 0f)
                            put("timestamp", location.time.toString())
                        }

                        promise.resolve(locationJson.toString())
                    } catch (e: Exception) {
                        promise.reject("JSON_ERROR", "Failed to create JSON", e)
                    }
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