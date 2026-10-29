import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { directionsTo, distanceKm, shelterLocations } from '@/lib/location';
import { colors, fonts } from '@/theme';

// Small live map with the shelter pin and your blue dot, plus a Directions button.
export function ShelterMap({ shelter }: { shelter: string }) {
  const place = shelterLocations[shelter];
  const [away, setAway] = useState<string | null>(null);

  // Only uses location if it was already allowed — no permission prompt on a pet page.
  useEffect(() => {
    if (!place) return;
    let active = true;
    Location.getForegroundPermissionsAsync()
      .then(({ granted }) => (granted ? Location.getLastKnownPositionAsync() : null))
      .then((pos) => {
        if (active && pos) setAway(`${distanceKm(pos.coords, place).toFixed(1)} km from you`);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [place]);

  if (!place) return null;

  return (
    <View style={styles.card}>
      <MapView
        style={styles.map}
        initialRegion={{ ...place, latitudeDelta: 0.03, longitudeDelta: 0.03 }}
        showsUserLocation
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={() => directionsTo(place)}
      >
        <Marker coordinate={place} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.pin}>
            <Ionicons name="home" size={16} color={colors.white} />
          </View>
        </Marker>
      </MapView>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{shelter}</Text>
          <Text style={styles.meta} numberOfLines={1}>
            {away ?? place.address}
          </Text>
        </View>
        <Pressable style={styles.button} onPress={() => directionsTo(place)}>
          <Ionicons name="navigate" size={16} color={colors.white} />
          <Text style={styles.buttonText}>Directions</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, overflow: 'hidden', backgroundColor: colors.white },
  map: { height: 150 },
  pin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.purple,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  name: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.black },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: colors.purple,
  },
  buttonText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.white },
});
