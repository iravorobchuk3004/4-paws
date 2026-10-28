import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui';
import { colors, fonts, shadow } from '@/theme';

// Active icons come from the design; Support has no active variant there, so it is tinted.
const tabs: Record<string, { label: string; icon: number; activeIcon?: number }> = {
  index: {
    label: 'Home',
    icon: require('../../assets/figma/tab-home-inactive.svg'),
    activeIcon: require('../../assets/figma/tab-home.svg'),
  },
  support: { label: 'Support', icon: require('../../assets/figma/tab-support.svg') },
  'my-pets': {
    label: 'My pets',
    icon: require('../../assets/figma/tab-heart.svg'),
    activeIcon: require('../../assets/figma/tab-heart-active.svg'),
  },
  profile: {
    label: 'Profile',
    icon: require('../../assets/figma/tab-profile.svg'),
    activeIcon: require('../../assets/figma/tab-profile-active.svg'),
  },
};

// Hidden routes inside the tabs (like "matches") belong to the Home tab.
const showsFoundButton = ['index', 'matches'];

export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index].name;
  const activeTab = tabs[current] ? current : 'index';

  return (
    <LinearGradient
      colors={['rgba(250,248,243,0)', 'rgba(250,248,243,0.92)', colors.cream]}
      locations={[0, 0.45, 1]}
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
      pointerEvents="box-none"
    >
      {showsFoundButton.includes(current) && (
        <Pressable style={styles.found} onPress={() => router.push('/found')}>
          <Icon source={require('../../assets/figma/found-pet.svg')} />
          <Text style={styles.foundText}>I found a pet</Text>
        </Pressable>
      )}
      <View style={styles.bar}>
        {state.routes.map((route) => {
          const tab = tabs[route.name];
          if (!tab) return null;
          const focused = route.name === activeTab;
          return (
            <Pressable
              key={route.key}
              style={styles.item}
              onPress={() => {
                if (route.name !== current) navigateToTab(route.key);
              }}
            >
              <Icon
                source={focused && tab.activeIcon ? tab.activeIcon : tab.icon}
                tint={focused && !tab.activeIcon ? colors.purple : undefined}
              />
              <Text style={[styles.label, focused && { color: colors.purple }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 30,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 7,
  },
  found: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: colors.purple,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  foundText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.white },
  bar: {
    alignSelf: 'stretch',
    height: 78,
    borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    ...shadow.card,
  },
  item: { alignItems: 'center', gap: 4, minWidth: 67 },
  label: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.black },
});
