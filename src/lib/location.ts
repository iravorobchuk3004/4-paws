import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export type Coords = { latitude: number; longitude: number };

export const HAMBURG: Coords = { latitude: 53.5511, longitude: 9.9937 };

// Shelter locations used for map pins and directions.
export const shelterLocations: Record<string, Coords & { address: string }> = {
  'Paw Haven': { latitude: 53.5717, longitude: 10.07, address: 'Wandsbeker Marktstraße 12, Hamburg' },
  'Safe Tails': { latitude: 53.5503, longitude: 9.935, address: 'Große Bergstraße 40, Hamburg' },
  'Happy Tails': { latitude: 53.574, longitude: 9.956, address: 'Osterstraße 88, Hamburg' },
};

// Short, human address like "Wandsbeker Marktstraße 12, Hamburg".
export async function addressFor(coords: Coords) {
  try {
    const [place] = await Location.reverseGeocodeAsync(coords);
    if (!place) return '';
    const street = [place.street, place.streetNumber].filter(Boolean).join(' ');
    return [street || place.name, place.district || place.city].filter(Boolean).join(', ');
  } catch {
    return '';
  }
}

// Asks for permission when needed, then returns the current position (or null if refused).
export async function locateMe(): Promise<Coords | null> {
  const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Location is off',
      'Allow location access so we can find where you are.',
      canAskAgain
        ? [{ text: 'OK' }]
        : [
            { text: 'Not now', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
    );
    return null;
  }
  const last = await Location.getLastKnownPositionAsync({ maxAge: 60_000 });
  const pos = last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

export const directionsTo = (to: Coords) =>
  Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${to.latitude},${to.longitude}`);

// Straight-line distance in km.
export function distanceKm(a: Coords, b: Coords) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}
