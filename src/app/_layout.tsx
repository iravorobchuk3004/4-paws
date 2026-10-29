import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { AppProvider } from '@/store';
import { colors } from '@/theme';

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.purple }} />;

  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="intro" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="welcome" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="onboarding/ready" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="application-sent" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="donation-thanks" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </AppProvider>
  );
}
