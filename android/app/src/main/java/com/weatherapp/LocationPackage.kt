package com.weatherapp

import com.facebook.react.ReactPackage
import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class LocationPackage : TurboReactPackage() {

	override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
		return if (name == LocationModule.NAME) LocationModule(reactContext) else null
	}

	override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
		return ReactModuleInfoProvider {
			val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
			moduleInfos[LocationModule.NAME] = ReactModuleInfo(
				LocationModule.NAME,
				LocationModule.NAME,
				false,
				false,
				true,
				BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
				false
			)
			moduleInfos
		}
	}
}

