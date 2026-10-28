import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Celebration } from '@/components/Celebration';
import { Tag } from '@/components/PetRow';
import { Progress } from '@/components/Progress';
import { PrimaryButton, SecondaryButton } from '@/components/ui';
import { euro, getCareNeed } from '@/data/care';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

export default function DonationThanks() {
  const params = useLocalSearchParams<{ id: string; amount: string; method: string }>();
  const need = getCareNeed(params.id);
  const amount = Number(params.amount) || 0;
  const { donated } = useApp();

  // Freeze the receipt details when the screen opens.
  const [receipt] = useState(() => {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return { reference: `DN-${1000 + Math.floor(Math.random() * 9000)}`, date: `${date} · ${time}` };
  });

  const raised = need.raised + (donated[need.id] ?? 0);
  const percent = Math.min(100, Math.round((raised / need.goal) * 100));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Thank you for helping</Text>
        <Celebration />

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Payment</Text>
            <Tag label="Confirmed" tone="purple" />
          </View>
          <View style={styles.divider} />
          <Row label="Reference" value={receipt.reference} />
          <Row label="Amount" value={`${euro(amount)} · ${params.method ?? 'Apple Pay'}`} />
          <Row label="Date" value={receipt.date} />
        </View>

        <View style={styles.card}>
          <View style={styles.fundRow}>
            <Image source={need.photo} style={styles.photo} contentFit="cover" />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.fundName}>{need.name}’s fund</Text>
              <Text style={styles.fundMeta}>
                {euro(raised)} raised of {euro(need.goal)}
              </Text>
            </View>
            <Text style={styles.percent}>{percent}%</Text>
          </View>
          <Progress value={raised / need.goal} />
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton title="Back to care needs" onPress={() => router.replace('/(tabs)/support')} />
        <SecondaryButton
          title="Download receipt"
          onPress={() => Alert.alert('Receipt', 'Receipts will be available once payments are connected.')}
        />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 48, paddingBottom: 24, gap: 24 },
  title: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.black, textAlign: 'center' },
  card: { padding: 16, gap: 12, borderRadius: 20, backgroundColor: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey },
  value: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  divider: { height: 1, backgroundColor: colors.greyBg },
  fundRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: { width: 40, height: 40, borderRadius: 8 },
  fundName: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  fundMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  percent: { fontFamily: fonts.bold, fontSize: 14, color: colors.purple },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 8 },
});
