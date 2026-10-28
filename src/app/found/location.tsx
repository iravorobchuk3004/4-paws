import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageTitle } from '@/components/form';
import { FormField, Icon, NavHeader, PrimaryButton } from '@/components/ui';
import { useFoundReport } from '@/components/FoundReport';
import { colors, fonts } from '@/theme';

const pin = require('../../../assets/figma/field-user.svg');

export default function FoundLocation() {
  const { report, update } = useFoundReport();
  const valid = report.location.trim().length > 0 && report.when.trim().length > 0;

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

        <Image source={require('../../../assets/figma/found-map.png')} style={styles.map} contentFit="cover" />

        {/* Demo: fills the area from the design until real location lookup is connected. */}
        <Pressable style={styles.useLocation} onPress={() => update({ location: 'Hamburg, Wandsbek' })}>
          <Icon source={require('../../../assets/figma/crosshair.svg')} size={20} />
          <Text style={styles.useLocationText}>Use my current location</Text>
        </Pressable>

        <View style={{ gap: 16 }}>
          <FormField
            label="Found location · required"
            placeholder="Hamburg, Wandsbek"
            icon={pin}
            value={report.location}
            onChangeText={(location) => update({ location })}
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
          />
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title="Continue to assistance"
          onPress={valid ? () => router.push('/found/assistance') : undefined}
          style={!valid && { opacity: 0.5 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, gap: 24 },
  map: { height: 180, borderRadius: 20 },
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
