#import <React/RCTBridge.h>
#import <React/RCTEventEmitter.h>
#import <CoreLocation/CoreLocation.h>
#import "WTHRLocationSpec.h"

@interface Location : RCTEventEmitter <WTHRLocationSpec, CLLocationManagerDelegate>
@end

@implementation Location {
	CLLocationManager *_manager;
	NSMutableSet<NSNumber *> *_watchers;
	NSInteger _nextWatchId;
	RCTPromiseResolveBlock _pendingResolve;
	RCTPromiseRejectBlock _pendingReject;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
	if (self = [super init]) {
		_manager = [CLLocationManager new];
		_manager.delegate = self;
		_manager.desiredAccuracy = kCLLocationAccuracyBest;
		_watchers = [NSMutableSet new];
		_nextWatchId = 1;
	}
	return self;
}

+ (BOOL)requiresMainQueueSetup { return YES; }

- (NSArray<NSString *> *)supportedEvents { return @[ @"locationUpdated" ]; }

- (void)addListener:(NSString *)eventName {}
- (void)removeListeners:(double)count {}

- (void)requestAuthorization:(BOOL)whenInUse
                    resolver:(RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject {
	CLAuthorizationStatus status;
	if (@available(iOS 14.0, *)) {
		status = _manager.authorizationStatus;
	} else {
		status = [CLLocationManager authorizationStatus];
	}
	if (status == kCLAuthorizationStatusAuthorizedAlways || status == kCLAuthorizationStatusAuthorizedWhenInUse) {
		resolve(@(YES));
		return;
	}
	_pendingResolve = [resolve copy];
	_pendingReject = [reject copy];
	if (whenInUse) {
		[_manager requestWhenInUseAuthorization];
	} else {
		[_manager requestAlwaysAuthorization];
	}
}

- (void)getCurrentPosition:(nullable NSNumber *)timeoutMs
                    resolver:(RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject {
	CLAuthorizationStatus status;
	if (@available(iOS 14.0, *)) {
		status = _manager.authorizationStatus;
	} else {
		status = [CLLocationManager authorizationStatus];
	}
	if (!(status == kCLAuthorizationStatusAuthorizedAlways || status == kCLAuthorizationStatusAuthorizedWhenInUse)) {
		reject(@"E_LOCATION_PERMISSION", @"Location permission not granted", nil);
		return;
	}
	_pendingResolve = [resolve copy];
	_pendingReject = [reject copy];
	[_manager requestLocation];
}

- (double)watchPosition:(NSDictionary *)options {
	NSNumber *interval = options && options[@"intervalMs"] ? options[@"intervalMs"] : @(10000);
	(void)interval; // iOS CoreLocation does not support interval directly; we use best effort
	NSInteger watchId = _nextWatchId++;
	[_watchers addObject:@(watchId)];
	[_manager startUpdatingLocation];
	return (double)watchId;
}

- (void)clearWatch:(double)watchId {
	NSNumber *key = @((NSInteger)watchId);
	if ([_watchers containsObject:key]) {
		[_watchers removeObject:key];
		if (_watchers.count == 0) {
			[_manager stopUpdatingLocation];
		}
	}
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorization:(CLAuthorizationStatus)status {
	if (_pendingResolve) {
		BOOL granted = (status == kCLAuthorizationStatusAuthorizedAlways || status == kCLAuthorizationStatusAuthorizedWhenInUse);
		_pendingResolve(@(granted));
		_pendingResolve = nil;
		_pendingReject = nil;
	}
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
	CLLocation *loc = locations.lastObject;
	if (!loc) return;
	NSDictionary *coords = @{ @"latitude": @(loc.coordinate.latitude),
							 @"longitude": @(loc.coordinate.longitude),
							 @"accuracy": @(loc.horizontalAccuracy),
							 @"altitude": @(loc.verticalAccuracy >= 0 ? loc.altitude : NAN),
							 @"heading": @(loc.course >= 0 ? loc.course : NAN),
							 @"speed": @(loc.speed >= 0 ? loc.speed : NAN) };
	NSDictionary *payload = @{ @"coords": coords, @"timestamp": @([loc.timestamp timeIntervalSince1970] * 1000.0) };
	if (_pendingResolve) {
		_pendingResolve(payload);
		_pendingResolve = nil;
		_pendingReject = nil;
		return;
	}
	if (_watchers.count > 0) {
		[self sendEventWithName:@"locationUpdated" body:payload];
	}
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
	if (_pendingReject) {
		_pendingReject(@"E_LOCATION_UNAVAILABLE", error.localizedDescription, error);
		_pendingResolve = nil;
		_pendingReject = nil;
	}
}

@end

