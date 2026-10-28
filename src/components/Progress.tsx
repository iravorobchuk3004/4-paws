import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

export function Progress({ value }: { value: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.value, { width: `${Math.min(100, Math.round(value * 100))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: 100, backgroundColor: colors.greyBg, overflow: 'hidden' },
  value: { height: 6, borderRadius: 100, backgroundColor: colors.purple },
});
