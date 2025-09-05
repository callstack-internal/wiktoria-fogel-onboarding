import Foundation
import CoreLocation
import React

@objc(NativeLocationService)
class NativeLocationService: NSObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?

    @objc func getCurrentLocationDetails(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.first else { return }
        locationManager.stopUpdatingLocation()

        let locationDetails: [String: Any] = [
            "latitude": location.coordinate.latitude,
            "longitude": location.coordinate.longitude,
            "altitude": location.altitude,
            "horizontalAccuracy": location.horizontalAccuracy,
            "verticalAccuracy": location.verticalAccuracy,
            "timestamp": location.timestamp.description
        ]

        do {
            let jsonData = try JSONSerialization.data(withJSONObject: locationDetails, options: .prettyPrinted)
            if let jsonString = String(data: jsonData, encoding: .utf8) {
                resolve?(jsonString)
            }
        } catch {
            reject?("JSON_ERROR", "Failed to serialize location data to JSON", error)
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        locationManager.stopUpdatingLocation()
        reject?("LOCATION_ERROR", "Failed to get location", error)
    }
}