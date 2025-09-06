package com.weatherapp

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.os.Looper
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*
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

        // sprawdzenie uprawnień
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
        )
            .setMinUpdateIntervalMillis(500)
            .setMaxUpdates(1)
            .build()

        val locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                fusedLocationClient.removeLocationUpdates(this)
                val location: Location? = locationResult.lastLocation

                if (location != null) {
                    try {
                        val result = Arguments.createMap().apply {
                            putDouble("latitude", location.latitude)
                            putDouble("longitude", location.longitude)
                            putDouble("altitude", location.altitude)
                            putDouble("horizontalAccuracy", location.accuracy.toDouble())
                            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O &&
                                location.hasVerticalAccuracy()
                            ) {
                                putDouble("verticalAccuracy", location.verticalAccuracyMeters.toDouble())
                            } else {
                                putDouble("verticalAccuracy", 0.0)
                            }
                            putString("timestamp", location.time.toString())
                        }
                        promise.resolve(result)
                    } catch (e: Exception) {
                        promise.reject("LOCATION_PARSING_ERROR", e.message, e)
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
