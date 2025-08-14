import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
  const [loaded, error] = useFonts({
    "SUIT-400": require("../../assets/fonts/SUIT-Regular.ttf"),
    "SUIT-500": require("../../assets/fonts/SUIT-Medium.ttf"),
    "SUIT-600": require("../../assets/fonts/SUIT-SemiBold.ttf"),
    "SUIT-700": require("../../assets/fonts/SUIT-Bold.ttf"),
    "SUIT-800": require("../../assets/fonts/SUIT-ExtraBold.ttf"),
    Gangwon: require("../../assets/fonts/GANGWONSTATE-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
