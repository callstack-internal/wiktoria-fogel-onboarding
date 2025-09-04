#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#import "NativeLocationModuleSpec.h"
#import <CoreLocation/CoreLocation.h>

@interface LocationModule : NSObject <NativeLocationModuleSpec, CLLocationManagerDelegate>
@end

@implementation LocationModule {
	CLLocationManager *_locationManager;
	RCTPromiseResolveBlock _resolve;
	RCTPromiseRejectBlock _reject;
}

RCT_EXPORT_MODULE(LocationModule)

- (void)getCurrentLocation:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject
{
	_resolve = resolve;
	_reject = reject;
	if (_locationManager == nil) {
		_locationManager = [CLLocationManager new];
		_locationManager.delegate = self;
		_locationManager.desiredAccuracy = kCLLocationAccuracyBest;
	}
	if ([_locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
		[_locationManager requestWhenInUseAuthorization];
	}
	[_locationManager startUpdatingLocation];
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations
{
	CLLocation *loc = locations.lastObject;
	if (loc && _resolve) {
		NSDictionary *result = @{
			@"latitude": @(loc.coordinate.latitude),
			@"longitude": @(loc.coordinate.longitude),
			@"accuracy": @(loc.horizontalAccuracy),
			@"altitude": @(loc.altitude),
			@"heading": @(loc.course),
			@"speed": @(loc.speed)
		};
		_resolve(result);
		_resolve = nil;
		_reject = nil;
		[manager stopUpdatingLocation];
	}
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
	if (_reject) {
		_reject(@"LOCATION_ERROR", error.localizedDescription, error);
		_resolve = nil;
		_reject = nil;
	}
}

@end

