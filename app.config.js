export default {
  expo: {
    name: "서행",
    slug: "SeoHaeng_FE",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "seohaeng",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.gyurijake.seohaengfe",
      versionCode: 2,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
      },
      // 폰트 스케일링 비활성화
      allowBackup: false,
      supportsRtl: false,
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "seo-haeng-lzhhfydkd-jakes-projects-9747705d.vercel.app",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon.png",
    },
    plugins: ["expo-router", "expo-web-browser"],
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
        projectId: "723ac499-62aa-4ede-8dd0-da0dcbf3b826",
      },
    },
  },
};
