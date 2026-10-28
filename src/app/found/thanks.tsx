import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Celebration } from '@/components/Celebration';
import { useFoundReport } from '@/components/FoundReport';
import { Tag } from '@/components/PetRow';
import { Icon, PrimaryButton, SecondaryButton } from '@/components/ui';
import { colors, fonts } from '@/theme';

export default function FoundThanks() {
  const { report } = useFoundReport();
  const [caseId] = useState(() => `FP-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`);

  const time = report.when.split('·')[1]?.trim();
  const help = report.help.map((h, i) => (i === 0 ? h.split(' ')[0] : h.toLowerCase())).join(' + ');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={{ gap: 12, paddingTop: 32 }}>
          <Text style={styles.title}>Thank you for helping</Text>
          <Celebration />
        </View>

        <View style={styles.card}>
          <View style={styles.animal}>
            <Image
              source={report.photos[0] ? { uri: report.photos[0] } : require('../../../assets/figma/found-photo.jpg')}
              style={styles.photo}
              contentFit="cover"
            />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.name}>Found {report.animal.toLowerCase()}</Text>
              <Text style={styles.meta}>{[report.location, time].filter(Boolean).join(' · ')}</Text>
            </View>
            <Tag label={caseId} tone="purple" />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Help requested</Text>
            <Text style={styles.value}>{help}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Tag label="Awaiting coordinator" tone="purple" />
          </View>
        </View>

        <View style={styles.note}>
          <Icon source={require('../../../assets/figma/info.svg')} size={20} />
          <Text style={styles.noteText}>Add an update if the pet moves or its condition changes.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title="Add a case update"
          onPress={() => Alert.alert('Case update', 'Case updates will be available once volunteers are connected.')}
        />
        <SecondaryButton title="Back to Home" onPress={() => router.dismissTo('/(tabs)')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 24 },
  title: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.black, textAlign: 'center' },
  card: { padding: 16, gap: 12, borderRadius: 20, backgroundColor: colors.white },
  animal: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: { width: 48, height: 48, borderRadius: 8, backgroundColor: colors.greyBg },
  name: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  divider: { height: 1, backgroundColor: colors.greyBg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey },
  value: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.purpleTint,
  },
  noteText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.black },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 8 },
});
