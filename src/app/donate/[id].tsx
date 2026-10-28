import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Fragment, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Progress } from '@/components/Progress';
import { Icon, NavHeader, PrimaryButton } from '@/components/ui';
import { euro, getCareNeed } from '@/data/care';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const presets = [100, 300, 500];
const MIN = 20;
const methods = [
  { id: 'Apple Pay', icon: require('../../../assets/figma/pay-apple.svg') },
  { id: 'Card', icon: require('../../../assets/figma/pay-card.svg') },
];

export default function Donate() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const need = getCareNeed(id);
  const { donated, donate } = useApp();
  const raised = need.raised + (donated[need.id] ?? 0);

  const [amountText, setAmountText] = useState('300');
  const [method, setMethod] = useState('Apple Pay');
  const amount = parseInt(amountText, 10) || 0;
  const valid = amount >= MIN;

  // Demo only: no payment is taken, the donation is recorded locally.
  const submit = () => {
    donate(need.id, amount);
    router.replace({ pathname: '/donation-thanks', params: { id: need.id, amount, method } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Support" />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View style={[styles.card, { gap: 12 }]}>
          <View style={styles.row}>
            <Image source={need.photo} style={styles.photo} contentFit="cover" />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.petName}>Support {need.name}</Text>
              <Text style={styles.meta}>
                {need.need} · {euro(Math.max(0, need.goal - raised))} still needed
              </Text>
            </View>
          </View>
          <Progress value={raised / need.goal} />
        </View>

        <View style={{ gap: 12 }}>
          <Text style={styles.sectionTitle}>One-time donation</Text>
          <View style={styles.presets}>
            {presets.map((p) => {
              const active = amount === p;
              return (
                <Pressable
                  key={p}
                  style={[styles.preset, active && styles.presetActive]}
                  onPress={() => setAmountText(String(p))}
                >
                  <Text style={[styles.presetText, active && { color: colors.purple }]}>{euro(p)}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Custom amount</Text>
            <View style={styles.input}>
              <Text style={styles.currency}>€</Text>
              <TextInput
                value={amountText}
                onChangeText={(t) => setAmountText(t.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                style={styles.inputText}
              />
            </View>
            <Text style={[styles.hint, !valid && { color: '#C0392B' }]}>Minimum {euro(MIN)}</Text>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Text style={styles.sectionTitle}>Payment method</Text>
          <View style={[styles.card, { paddingVertical: 4 }]}>
            {methods.map((m, i) => (
              <Fragment key={m.id}>
                {i > 0 && <View style={styles.divider} />}
                <Pressable style={styles.method} onPress={() => setMethod(m.id)}>
                  <Icon source={m.icon} size={22} />
                  <Text style={styles.methodText}>{m.id}</Text>
                  <View style={{ flex: 1 }} />
                  <Icon
                    source={
                      method === m.id
                        ? require('../../../assets/figma/radio-on.svg')
                        : require('../../../assets/figma/radio-off.svg')
                    }
                    size={method === m.id ? 16 : 20}
                  />
                </Pressable>
              </Fragment>
            ))}
          </View>
        </View>

        <View style={[styles.card, { gap: 12 }]}>
          <SummaryRow label={`To ${need.name}’s fund`} value={euro(amount)} />
          <SummaryRow label="Service fee" value="€0" />
          <View style={styles.divider} />
          <SummaryRow label="Total today" value={euro(amount)} total />
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title={`Donate ${euro(amount)}`}
          onPress={valid ? submit : undefined}
          style={!valid && { opacity: 0.5 }}
        />
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, total }: { label: string; value: string; total?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={total ? styles.summaryTotal : styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, gap: 24 },
  card: { padding: 16, borderRadius: 20, backgroundColor: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: { width: 56, height: 56, borderRadius: 8, backgroundColor: colors.greyBg },
  petName: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  presets: { flexDirection: 'row', gap: 8 },
  preset: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: colors.white,
  },
  presetActive: { backgroundColor: colors.purpleSelected, borderColor: colors.purple },
  presetText: { fontFamily: fonts.bold, fontSize: 18, color: colors.black },
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.black },
  input: {
    height: 56,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  currency: { fontFamily: fonts.medium, fontSize: 16, color: colors.grey },
  inputText: { flex: 1, fontFamily: fonts.regular, fontSize: 16, color: colors.black },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  divider: { height: 1, backgroundColor: colors.greyBg },
  method: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  methodText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey },
  summaryValue: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  summaryTotal: { fontFamily: fonts.bold, fontSize: 16, color: colors.black },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
