import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Insets, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/theme';

// Pressable that squishes down on touch and springs back on release.
export function PressableScale({
  children,
  onPress,
  onLongPress,
  style,
  scaleTo = 0.95,
  hitSlop,
}: {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  hitSlop?: number | Insets;
}) {
  const [scale] = useState(() => new Animated.Value(1));
  const to = (value: number) =>
    Animated.spring(scale, { toValue: value, friction: 5, tension: 300, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => onPress && to(scaleTo)}
      onPressOut={() => to(1)}
      hitSlop={hitSlop}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

// Slides content up into place, optionally after a delay (for staggered lists).
export function FadeInUp({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(t, {
      toValue: 1,
      duration: 450,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [delay, t]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: t,
          transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const SPARKS = 6;

// Wraps a heart icon: when `active` turns on it pops and throws out little sparks.
export function LikePop({ active, children }: { active: boolean; children: ReactNode }) {
  const [scale] = useState(() => new Animated.Value(1));
  const [burst] = useState(() => new Animated.Value(1));
  const wasActive = useRef(active);

  useEffect(() => {
    const justLiked = active && !wasActive.current;
    wasActive.current = active;
    if (!justLiked) return;
    scale.setValue(0.6);
    burst.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }),
      Animated.timing(burst, { toValue: 1, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [active, scale, burst]);

  return (
    <View>
      {Array.from({ length: SPARKS }, (_, i) => {
        const angle = (i / SPARKS) * Math.PI * 2;
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={[
              styles.spark,
              {
                backgroundColor: i % 2 ? colors.purple : colors.pink,
                opacity: burst.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
                transform: [
                  { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * 16] }) },
                  { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * 16] }) },
                ],
              },
            ]}
          />
        );
      })}
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  spark: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 5,
    height: 5,
    marginLeft: -2.5,
    marginTop: -2.5,
    borderRadius: 2.5,
  },
});
