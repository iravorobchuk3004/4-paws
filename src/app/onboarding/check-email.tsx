import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { NavHeader, PrimaryButton, SecondaryButton } from '@/components/ui';
import { colors, fonts } from '@/theme';

const RESEND_AFTER = 30;

export default function CheckEmail() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [wait, setWait] = useState(RESEND_AFTER);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader />
      <View style={styles.body}>
        <FadeInUp style={styles.iconWrap}>
          <Ionicons name="mail-open-outline" size={44} color={colors.purple} />
        </FadeInUp>
        <FadeInUp delay={120} style={{ gap: 8 }}>
          <Text style={styles.title}>Check your inbox</Text>
          <Text style={styles.text}>
            We sent a reset link to <Text style={styles.email}>{email}</Text>. It works for 30 minutes. Don’t see it?
            Check your spam folder.
          </Text>
        </FadeInUp>
        <Pressable disabled={wait > 0} onPress={() => setWait(RESEND_AFTER)} hitSlop={8}>
          <Text style={[styles.resend, wait > 0 && { color: colors.grey1 }]}>
            {wait > 0 ? `Resend link in ${wait}s` : 'Resend link'}
          </Text>
        </Pressable>
      </View>
      <View style={styles.bottom}>
        <PrimaryButton title="Open mail app" onPress={() => Linking.openURL('message://').catch(() => {})} />
        <SecondaryButton title="Back to sign in" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, gap: 24 },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.purpleTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.extraBold, fontSize: 26, color: colors.black, textAlign: 'center' },
  text: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.grey, textAlign: 'center' },
  email: { fontFamily: fonts.semiBold, color: colors.black },
  resend: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.purple },
  bottom: { paddingHorizontal: 20, paddingBottom: 8, gap: 8 },
});
