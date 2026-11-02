import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp, PressableScale } from '@/components/anim';
import { WigglingMascot } from '@/components/Celebration';
import { enterApp } from '@/lib/onboarding';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

// Welcome in the same language as the quiz: the dog mascot on a splash colour, big type
// and two clear buttons.
export default function Welcome() {
  const { setGoal } = useApp();

  const explore = () => {
    setGoal('explore');
    enterApp('explore');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <Ionicons name="paw" size={18} color={colors.purple} />
          <Text style={styles.brandText}>4 Paws</Text>
        </View>
        <Pressable onPress={() => router.push('/onboarding/sign-in')} hitSlop={10} style={styles.pill}>
          <Text style={styles.pillText}>Sign in</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <FadeInUp style={styles.hero}>
          <View style={styles.sun} />
          <WigglingMascot animal="dog" width={280} height={300} />
        </FadeInUp>

        <FadeInUp delay={100} style={{ gap: 8 }}>
          <Text style={styles.title}>Find a friend who fits your life</Text>
          <Text style={styles.subtitle}>Adopt, support or help a lost pet, all in one place.</Text>
        </FadeInUp>
      </View>

      <View style={styles.bottom}>
        <PressableScale onPress={() => router.push('/onboarding/quiz')} style={styles.cta}>
          <Text style={styles.ctaText}>Get started</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </PressableScale>
        <PressableScale onPress={explore} style={styles.ghost}>
          <Text style={styles.ghostText}>Explore as a guest</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { height: 48, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandText: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.black },
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100, backgroundColor: colors.white },
  pillText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  body: { flex: 1, paddingHorizontal: 20, paddingBottom: 8, gap: 20 },
  // The hero takes whatever height is left, so nothing overlaps on small phones.
  hero: {
    flex: 1,
    minHeight: 220,
    borderRadius: 32,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginTop: 4,
  },
  sun: { position: 'absolute', top: '12%', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,255,255,0.55)' },
  title: { fontFamily: fonts.extraBold, fontSize: 28, lineHeight: 34, color: colors.black },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.grey },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 10 },
  cta: {
    height: 56,
    borderRadius: 100,
    backgroundColor: colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.white },
  ghost: {
    height: 56,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.greyOption,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
});
