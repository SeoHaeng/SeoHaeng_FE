export default {
  expo: {
    name: "서행",
    slug: "SeoHaeng_FE",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "seohaeng",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#302E2D",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      associatedDomains: ["applinks:seo-haeng-fe.vercel.app"],
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
              host: "seo-haeng-fe.vercel.app",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
        {
          action: "VIEW",
          data: [
            {
              scheme: "market",
              host: "details",
              query: "id=com.gyurijake.seohaengfe",
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
      rewrites: [
        {
          source: "/bookstore/(.*)",
          destination: "/bookstore/[id]",
        },
        {
          source: "/travel/(.*)",
          destination: "/travel/[id]",
        },
        {
          source: "/popularity/(.*)",
          destination: "/popularity/[id]",
        },
        {
          source: "/bookmark/(.*)",
          destination: "/bookmark/[id]",
        },
      ],
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
