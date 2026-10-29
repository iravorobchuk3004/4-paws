import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavHeader, PageHeading, SecondaryButton } from '@/components/ui';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const faq = [
  {
    q: 'How does adopting through 4 Paws work?',
    a: 'Save the animals you like, then apply for a meeting. The shelter contacts you within about 2 working days to agree a date. Nothing is final until you have met the pet.',
  },
  {
    q: 'Is my donation safe?',
    a: 'Donations go to the named animal’s care fund at the shelter. You get a receipt with a reference number for every donation.',
  },
  {
    q: 'I found an animal. What should I do first?',
    a: 'Keep a safe distance if it seems scared or injured. Use “I found a pet” to share photos and the exact place so volunteers can reach it quickly. In an emergency, call a local vet.',
  },
  {
    q: 'What data do you keep?',
    a: 'Your name, email, phone (if you add it), saved animals and applications. They are stored on this phone. You can delete them below at any time.',
  },
];

export default function Help() {
  const { resetAll } = useApp();
  const [open, setOpen] = useState<number | null>(0);

  const deleteData = () =>
    Alert.alert('Delete all my data?', 'This removes your account details, saved animals and applications from this phone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          resetAll();
          router.dismissAll();
          router.replace('/welcome');
        },
      },
    ]);

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Profile" />
      <ScrollView contentContainerStyle={styles.body}>
        <PageHeading title="Help & privacy" subtitle="Answers to common questions and control over your data." />

        <View style={styles.card}>
          {faq.map((item, i) => (
            <Pressable key={item.q} onPress={() => setOpen(open === i ? null : i)} style={[styles.item, i > 0 && styles.divider]}>
              <View style={styles.qRow}>
                <Text style={styles.q}>{item.q}</Text>
                <Text style={styles.toggle}>{open === i ? '−' : '+'}</Text>
              </View>
              {open === i && <Text style={styles.a}>{item.a}</Text>}
            </Pressable>
          ))}
        </View>

        <SecondaryButton title="Delete my data" onPress={deleteData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingBottom: 24, gap: 24 },
  card: { paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.white },
  item: { paddingVertical: 14, gap: 8 },
  divider: { borderTopWidth: 1, borderTopColor: colors.greyBg },
  qRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  q: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  toggle: { fontFamily: fonts.semiBold, fontSize: 20, color: colors.purple },
  a: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.grey },
});
