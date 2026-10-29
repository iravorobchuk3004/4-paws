import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, shadow } from '@/theme';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const PAD = 4;

// Segmented control for the animal type, with a purple pill that slides to the selection.
export function KindSwitch<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon: IconName }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const [width, setWidth] = useState(0);
  const [x] = useState(() => new Animated.Value(0));
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const segment = width ? (width - PAD * 2) / options.length : 0;

  useEffect(() => {
    Animated.spring(x, { toValue: index * segment, friction: 8, tension: 90, useNativeDriver: true }).start();
  }, [index, segment, x]);

  return (
    <View style={styles.track} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {segment > 0 && (
        <Animated.View style={[styles.pill, { width: segment, transform: [{ translateX: x }] }]} />
      )}
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable key={o.value} style={styles.segment} onPress={() => onChange(o.value)}>
            <MaterialCommunityIcons name={o.icon} size={18} color={active ? colors.white : colors.grey} />
            <Text style={[styles.label, active && styles.labelActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: 48,
    padding: PAD,
    borderRadius: 24,
    backgroundColor: colors.white,
    ...shadow.card,
    shadowOpacity: 0.05,
  },
  pill: {
    position: 'absolute',
    top: PAD,
    bottom: PAD,
    left: PAD,
    borderRadius: 20,
    backgroundColor: colors.purple,
  },
  segment: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.grey },
  labelActive: { fontFamily: fonts.semiBold, color: colors.white },
});
