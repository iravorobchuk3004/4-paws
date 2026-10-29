import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Category } from '@/data/pets';
import { colors, fonts } from '@/theme';

const SIZE = 64;
const RING = 2;
const GAP = 3;

// Round emoji tile. When selected, a purple ring sits just outside the circle.
export function CategoryTile({ category, selected, onPress }: { category: Category; selected: boolean; onPress: () => void }) {
  return (
    <Pressable style={styles.tile} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }}>
      <View style={[styles.ring, selected && styles.ringSelected]}>
        <View style={[styles.circle, { backgroundColor: category.color }]}>
          <Text style={styles.emoji}>{category.emoji}</Text>
        </View>
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
        {category.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { width: 76, alignItems: 'center', gap: 6 },
  ring: {
    width: SIZE + (RING + GAP) * 2,
    height: SIZE + (RING + GAP) * 2,
    borderRadius: (SIZE + (RING + GAP) * 2) / 2,
    borderWidth: RING,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSelected: { borderColor: colors.purple },
  circle: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 32, lineHeight: 40 },
  label: { fontFamily: fonts.medium, fontSize: 12, color: colors.black },
  labelSelected: { fontFamily: fonts.bold, color: colors.purple },
});
