import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextArea } from '@/components/form';
import { Tag } from '@/components/PetRow';
import { Timeline } from '@/components/Timeline';
import { NavHeader, PrimaryButton, SecondaryButton } from '@/components/ui';
import { formatDate, useApp } from '@/store';
import { colors, fonts } from '@/theme';

// A found-pet case: its status, the updates the finder added, and closing it.
export default function ReportCase() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reports, addReportUpdate, resolveReport } = useApp();
  const [text, setText] = useState('');
  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <NavHeader step="Case" />
        <View style={styles.missing}>
          <Text style={styles.missingText}>This case is no longer on this phone.</Text>
          <SecondaryButton title="Back to Home" onPress={() => router.replace('/(tabs)')} />
        </View>
      </SafeAreaView>
    );
  }

  const send = () => {
    if (!text.trim()) return;
    addReportUpdate(report.id, text.trim());
    setText('');
  };

  const resolve = () =>
    Alert.alert('Close this case?', 'Do this when the pet is safe: back with its owner, at a shelter or with a foster.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Pet is safe', onPress: () => resolveReport(report.id) },
    ]);

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step={report.id} />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View style={styles.card}>
          <Image
            source={report.photo ? { uri: report.photo } : require('../../../assets/figma/found-photo.jpg')}
            style={styles.photo}
            contentFit="cover"
          />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.name}>Found {report.animal.toLowerCase()}</Text>
            <Text style={styles.meta}>{report.location}</Text>
            <Text style={styles.meta}>Reported {formatDate(report.createdAt)}</Text>
          </View>
          <Tag label={report.resolved ? 'Closed' : 'Open'} tone={report.resolved ? 'grey' : 'purple'} />
        </View>

        <View style={[styles.card, styles.column]}>
          <Timeline
            steps={[
              { title: 'Request received', text: formatDate(report.createdAt), state: 'done' },
              {
                title: 'Coordinator reviews it',
                text: `Looking for ${report.help.join(', ').toLowerCase() || 'help'} nearby.`,
                state: report.resolved ? 'done' : 'current',
              },
              {
                title: 'Pet is safe',
                text: report.resolved ? 'Case closed. Thank you!' : 'Close the case when the pet is safe.',
                state: report.resolved ? 'done' : 'next',
              },
            ]}
          />
        </View>

        <View style={{ gap: 12 }}>
          <Text style={styles.sectionTitle}>Updates</Text>
          {report.updates.length ? (
            report.updates.map((u) => (
              <View key={u.at} style={styles.update}>
                <Text style={styles.updateTime}>{formatDate(u.at)}</Text>
                <Text style={styles.updateText}>{u.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.meta}>No updates yet. Add one if the pet moves or its condition changes.</Text>
          )}
          {!report.resolved && (
            <>
              <TextArea
                label="New update"
                placeholder="Moved to a quiet courtyard behind the bakery. Drinking water."
                value={text}
                onChangeText={setText}
              />
              <PrimaryButton title="Post update" onPress={send} style={!text.trim() && { opacity: 0.5 }} />
            </>
          )}
        </View>

        {!report.resolved && <SecondaryButton title="The pet is safe · close case" onPress={resolve} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 20 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, backgroundColor: colors.white },
  column: { flexDirection: 'column', alignItems: 'stretch' },
  photo: { width: 64, height: 64, borderRadius: 12, backgroundColor: colors.greyBg },
  name: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.grey },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  update: { padding: 14, gap: 4, borderRadius: 16, backgroundColor: colors.purpleTint },
  updateTime: { fontFamily: fonts.medium, fontSize: 12, color: colors.purple },
  updateText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.black },
  missing: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  missingText: { fontFamily: fonts.regular, fontSize: 15, color: colors.grey, textAlign: 'center' },
});
