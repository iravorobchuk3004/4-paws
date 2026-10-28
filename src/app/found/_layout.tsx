import { Stack } from 'expo-router';

import { FoundReportProvider } from '@/components/FoundReport';
import { colors } from '@/theme';

export default function FoundLayout() {
  return (
    <FoundReportProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
        <Stack.Screen name="thanks" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </FoundReportProvider>
  );
}
