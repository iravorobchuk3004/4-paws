import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import { Category, Motion } from '@/data/pets';
import { colors, fonts } from '@/theme';

// One looping "idle" animation per mascot; `t` runs 0 → 1 → 0 forever.
function motionStyle(motion: Motion, t: Animated.Value) {
  const r = (deg: number) => t.interpolate({ inputRange: [0, 1], outputRange: [`${-deg}deg`, `${deg}deg`] });
  switch (motion) {
    case 'wag':
      return { transform: [{ rotate: r(12) }] };
    case 'tilt':
      return { transform: [{ rotate: r(8) }, { scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }] };
    case 'hop':
      return {
        transform: [
          { translateY: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -10, 0] }) },
          { scaleY: t.interpolate({ inputRange: [0, 0.1, 0.5, 0.9, 1], outputRange: [0.9, 1.05, 1, 1.05, 0.9] }) },
        ],
      };
    case 'flap':
      return {
        transform: [
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [2, -5] }) },
          { rotate: r(10) },
        ],
      };
    case 'sleep':
      return { transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.06] }) }] };
    case 'run':
      return { transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [-5, 5] }) }, { rotate: r(4) }] };
    case 'spin':
      return { transform: [{ rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['-15deg', '15deg'] }) }] };
  }
}

const speed: Record<Motion, number> = { wag: 220, tilt: 900, hop: 700, flap: 260, sleep: 1500, run: 300, spin: 1100 };

export function CategoryTile({ category, selected, onPress }: { category: Category; selected: boolean; onPress: () => void }) {
  const [t] = useState(() => new Animated.Value(0));
  const [zzz] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const duration = speed[category.motion] / (selected ? 1.6 : 1);
    const ease = Easing.inOut(Easing.sin);
    const loop =
      category.motion === 'hop'
        ? Animated.loop(Animated.sequence([Animated.timing(t, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true }), Animated.delay(400), Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: true })]))
        : Animated.loop(
            Animated.sequence([
              Animated.timing(t, { toValue: 1, duration, easing: ease, useNativeDriver: true }),
              Animated.timing(t, { toValue: 0, duration, easing: ease, useNativeDriver: true }),
            ]),
          );
    loop.start();
    const z =
      category.motion === 'sleep'
        ? Animated.loop(Animated.timing(zzz, { toValue: 1, duration: 2200, easing: Easing.out(Easing.quad), useNativeDriver: true }))
        : null;
    z?.start();
    return () => {
      loop.stop();
      z?.stop();
    };
  }, [category.motion, selected, t, zzz]);

  return (
    <Pressable style={styles.tile} onPress={onPress} accessibilityState={{ selected }}>
      <View style={[styles.circle, { backgroundColor: category.color }, selected && styles.circleSelected]}>
        <Animated.Text style={[styles.emoji, motionStyle(category.motion, t)]}>{category.emoji}</Animated.Text>
        {category.motion === 'sleep' && (
          <Animated.Text
            style={[
              styles.zzz,
              {
                opacity: zzz.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
                transform: [
                  { translateY: zzz.interpolate({ inputRange: [0, 1], outputRange: [0, -14] }) },
                  { translateX: zzz.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }) },
                ],
              },
            ]}
          >
            z
          </Animated.Text>
        )}
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
        {category.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { width: 76, alignItems: 'center', gap: 6 },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  circleSelected: { borderColor: colors.purple, transform: [{ scale: 1.06 }] },
  emoji: { fontSize: 32 },
  zzz: { position: 'absolute', top: 6, right: 10, fontFamily: fonts.bold, fontSize: 14, color: colors.purple },
  label: { fontFamily: fonts.medium, fontSize: 12, color: colors.black },
  labelSelected: { fontFamily: fonts.bold, color: colors.purple },
});
