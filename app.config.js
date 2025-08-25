export default {
  expo: {
    name: "SeoHaeng_FE",
    slug: "SeoHaeng_FE",
    version: "1.0.0",
    orientation: "portrait",
    /* icon: "./assets/images/icon.png", */
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    /*  splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    }, */
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.gyurijake.seohaengfe",
      /*   adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      }, */
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      KAKAO_MAP_JS_KEY: process.env.KAKAO_MAP_JS_KEY,
      eas: {
        projectId: "723ac499-62aa-4ede-8dd0-da0dcbf3b826",
      },
    },
  },
};
