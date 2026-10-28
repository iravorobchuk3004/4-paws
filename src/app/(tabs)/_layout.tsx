import { Tabs } from 'expo-router';

import { TabBar } from '@/components/TabBar';
import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.cream } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="support" />
      <Tabs.Screen name="my-pets" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="matches" options={{ href: null }} />
    </Tabs>
  );
}
