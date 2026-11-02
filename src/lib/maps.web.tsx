import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/theme';

// Web stand-in for react-native-maps: a soft map-coloured panel with the marker in the middle.
// Used only by the browser preview; iOS and Android use the real maps.
export type MapPressEvent = { nativeEvent: { coordinate: { latitude: number; longitude: number } } };

export default function MapView({ style, children }: { style?: StyleProp<ViewStyle>; children?: ReactNode; [key: string]: unknown }) {
  return (
    <View style={[styles.map, style]}>
      <View style={[styles.road, { top: '30%', transform: [{ rotate: '-8deg' }] }]} />
      <View style={[styles.road, { top: '65%', transform: [{ rotate: '5deg' }] }]} />
      <View style={[styles.roadV, { left: '40%' }]} />
      <View style={styles.center}>{children}</View>
    </View>
  );
}

export function Marker({ children }: { children?: ReactNode; [key: string]: unknown }) {
  return <View>{children}</View>;
}

const styles = StyleSheet.create({
  map: { backgroundColor: '#E8EFE3', overflow: 'hidden' },
  road: { position: 'absolute', left: -20, right: -20, height: 10, backgroundColor: colors.white },
  roadV: { position: 'absolute', top: -20, bottom: -20, width: 10, backgroundColor: colors.white },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
