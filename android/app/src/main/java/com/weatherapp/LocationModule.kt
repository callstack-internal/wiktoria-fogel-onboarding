package com.weatherapp

import android.location.Location
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices

@ReactModule(name = "LocationModule")
class LocationModule(reactContext: ReactApplicationContext) : NativeLocationModuleSpec(reactContext) {
  private val fusedLocationClient: FusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(reactContext)

  override fun initialize() {
    // no-op
  }

  override fun invalidate() {
    // no-op
  }

  override fun getCurrentLocation(promise: Promise) {
    fusedLocationClient.lastLocation
      .addOnSuccessListener { location: Location? ->
        if (location != null) {
          val result = hashMapOf<String, Any>(
            "latitude" to location.latitude,
            "longitude" to location.longitude,
            "accuracy" to (location.accuracy.toDouble()),
            "altitude" to location.altitude,
            "heading" to (location.bearing.toDouble()),
            "speed" to (location.speed.toDouble())
          )
          promise.resolve(result)
        } else {
          promise.reject("LOCATION_ERROR", "Location not available")
        }
      }
      .addOnFailureListener { e ->
        promise.reject("LOCATION_ERROR", e)
      }
  }
}

