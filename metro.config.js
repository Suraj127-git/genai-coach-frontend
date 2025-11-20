const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Try-catch to safely add NativeWind
try {
  const { withNativeWind } = require('nativewind/metro');
  module.exports = withNativeWind(config, { input: './global.css' });
} catch (error) {
  console.warn('NativeWind metro config not available, using default config');
  module.exports = config;
}