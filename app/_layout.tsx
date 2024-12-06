import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  
  const [loaded, error] = useFonts({
    'Inter Tight': require('../assets/fonts/Inter Tight.ttf'),
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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ 
        headerShown: false, 
        animation:'slide_from_right'}}/>
      <Stack.Screen name="create-new-task" options={{ 
        headerShown: false, 
        animation:'slide_from_right'
      }}/>
      <Stack.Screen name="modify-task" options={{
        headerShown: false, 
        animation:'slide_from_right'
      }}/>
      <Stack.Screen name="+not-found" options={{
        headerShown: false, 
        animation:'slide_from_right'
       }}/>
    </Stack>
  );
}