export default {
  expo: {
    name: "서행",
    slug: "SeoHaeng_FE",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: process.env.ANDROID_PACKAGE_NAME,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon.png",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      KAKAO_MAP_JS_KEY: process.env.KAKAO_MAP_JS_KEY,
      KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
      KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
      KAKAO_STATE: process.env.KAKAO_STATE,
      ANDROID_PACKAGE_NAME: process.env.ANDROID_PACKAGE_NAME,
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
  },
};
