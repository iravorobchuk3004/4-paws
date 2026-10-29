import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageTitle } from '@/components/form';
import { FormField, Icon, NavHeader, PrimaryButton } from '@/components/ui';
import { useFoundReport } from '@/components/FoundReport';
import { addressFor, Coords, HAMBURG, locateMe } from '@/lib/location';
import { colors, fonts } from '@/theme';

const pin = require('../../../assets/figma/field-user.svg');

export default function FoundLocation() {
  const { report, update } = useFoundReport();
  const [submitted, setSubmitted] = useState(false);
  const [locating, setLocating] = useState(false);
  const map = useRef<MapView>(null);

  // Drop the found-pet pin and fill the address from it.
  const placePin = async (coords: Coords) => {
    update({ coords });
    const address = await addressFor(coords);
    if (address) update({ coords, location: address });
  };

  const useMyLocation = async () => {
    setLocating(true);
    const me = await locateMe();
    setLocating(false);
    if (!me) return;
    map.current?.animateToRegion({ ...me, latitudeDelta: 0.008, longitudeDelta: 0.008 }, 500);
    placePin(me);
  };
  const locationError = submitted && !report.location.trim() && 'Add where you found the pet, or use your location.';
  const whenError = submitted && !report.when.trim() && 'Add roughly when you saw the pet.';

  const next = () => {
    setSubmitted(true);
    if (report.location.trim() && report.when.trim()) router.push('/found/assistance');
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Step 2/3" />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <PageTitle
          title="Where did you find them?"
          subtitle="The exact place helps volunteers reach the pet quickly."
        />

        <View style={styles.map}>
          <MapView
            ref={map}
            style={StyleSheet.absoluteFill}
            initialRegion={{ ...(report.coords ?? HAMBURG), latitudeDelta: 0.06, longitudeDelta: 0.06 }}
            showsUserLocation
            onPress={(e: MapPressEvent) => placePin(e.nativeEvent.coordinate)}
          >
            {report.coords && (
              <Marker
                coordinate={report.coords}
                draggable
                onDragEnd={(e) => placePin(e.nativeEvent.coordinate)}
                anchor={{ x: 0.5, y: 1 }}
              >
                <View style={styles.pin}>
                  <FontAwesome6 name="paw" solid size={16} color={colors.white} />
                </View>
                <View style={styles.pinTip} />
              </Marker>
            )}
          </MapView>
          {!report.coords && (
            <View style={styles.mapHint} pointerEvents="none">
              <Text style={styles.mapHintText}>Tap the map where you found the pet</Text>
            </View>
          )}
        </View>

        <Pressable style={styles.useLocation} onPress={useMyLocation} disabled={locating}>
          {locating ? (
            <ActivityIndicator color={colors.purple} />
          ) : (
            <Icon source={require('../../../assets/figma/crosshair.svg')} size={20} />
          )}
          <Text style={styles.useLocationText}>{locating ? 'Finding you…' : 'Use my current location'}</Text>
        </Pressable>

        <View style={{ gap: 16 }}>
          <FormField
            label="Found location · required"
            placeholder="Hamburg, Wandsbek"
            icon={pin}
            value={report.location}
            onChangeText={(location) => update({ location })}
            error={locationError}
          />
          <FormField
            label="Landmark · optional"
            placeholder="Near the main entrance, beside a bench"
            icon={pin}
            value={report.landmark}
            onChangeText={(landmark) => update({ landmark })}
          />
          <FormField
            label="Date & time · required"
            placeholder="11 Oct 2026 · 09:15"
            icon={pin}
            value={report.when}
            onChangeText={(when) => update({ when })}
            error={whenError}
          />
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title="Continue to assistance"
          onPress={next}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, gap: 24 },
  map: { height: 240, borderRadius: 20, overflow: 'hidden', backgroundColor: colors.greyBg },
  mapHint: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
  },
  mapHintText: { fontFamily: fonts.medium, fontSize: 13, color: colors.black },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.purple,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinTip: {
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.purple,
    marginTop: -2,
  },
  useLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: colors.purple,
    backgroundColor: colors.white,
  },
  useLocationText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.purple },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
