import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/anim';
import { Icon } from '@/components/ui';
import { colors, fonts } from '@/theme';

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
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]} pointerEvents="box-none">
      {showsFoundButton.includes(current) && (
        <FoundButton />
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
              <BounceOnFocus focused={focused}>
                <Icon
                  source={focused && tab.activeIcon ? tab.activeIcon : tab.icon}
                  tint={focused && !tab.activeIcon ? colors.purple : undefined}
                />
              </BounceOnFocus>
              <Text style={[styles.label, focused && { color: colors.purple }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Hops the tab icon up when its tab becomes active.
function BounceOnFocus({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  const [lift] = useState(() => new Animated.Value(0));
  const wasFocused = useRef(focused);

  useEffect(() => {
    if (focused && !wasFocused.current) {
      lift.setValue(0);
      Animated.sequence([
        Animated.timing(lift, { toValue: 1, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(lift, { toValue: 0, friction: 3, tension: 180, useNativeDriver: true }),
      ]).start();
    }
    wasFocused.current = focused;
  }, [focused, lift]);

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
          { scale: lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

// "I found a pet" button that gently breathes and wiggles its icon to draw attention.
function FoundButton() {
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.delay(1600),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t]);

  return (
    <PressableScale onPress={() => router.push('/found')}>
      <Animated.View
        style={[styles.found, { transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }] }]}
      >
        <Animated.View
          style={{
            transform: [{ rotate: t.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: ['0deg', '-12deg', '0deg', '12deg', '0deg'] }) }],
          }}
        >
          <Icon source={require('../../assets/figma/found-pet.svg')} />
        </Animated.View>
        <Text style={styles.foundText}>I found a pet</Text>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    // One soft shadow, just enough to lift the bar off the content.
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  item: { alignItems: 'center', gap: 4, minWidth: 67 },
  label: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.black },
});
