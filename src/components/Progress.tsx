import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

// Progress bar that fills up on mount and slides to new values (e.g. after a donation).
export function Progress({ value }: { value: number }) {
  const target = Math.min(1, Math.max(0, value));
  const [fill] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fill, {
      toValue: target,
      duration: 900,
      delay: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [fill, target]);

  return (
    <View style={styles.track}>
      <Animated.View
        style={[styles.value, { width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: 100, backgroundColor: colors.greyBg, overflow: 'hidden' },
  value: { height: 6, borderRadius: 100, backgroundColor: colors.purple },
});
