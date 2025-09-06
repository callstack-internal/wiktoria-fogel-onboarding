#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(NativeLocationService, NSObject)

RCT_EXTERN_METHOD(getCurrentLocationDetails: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end