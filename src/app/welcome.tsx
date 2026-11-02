import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp, PressableScale } from '@/components/anim';
import { WigglingMascot } from '@/components/Celebration';
import { enterApp } from '@/lib/onboarding';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const perks = [
  { emoji: '🧩', title: 'A 1-minute quiz', text: 'We match you with pets who fit your life.' },
  { emoji: '💜', title: 'Help without adopting', text: 'Support a named pet’s care.' },
  { emoji: '📍', title: 'Found a pet?', text: 'Get it help in three short steps.' },
];

// Welcome in the same language as the quiz: the mascots on a splash colour, big type,
// emoji tiles and one clear purple button.
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
          <View style={[styles.sun, { width: 220, height: 220, borderRadius: 110 }]} />
          <View style={[styles.side, { left: 6, transform: [{ rotate: '-8deg' }] }]}>
            <WigglingMascot animal="cat" width={120} height={150} />
          </View>
          <View style={[styles.side, { right: 6, transform: [{ rotate: '8deg' }] }]}>
            <WigglingMascot animal="rabbit" width={120} height={150} />
          </View>
          <WigglingMascot animal="dog" width={180} height={210} />
        </FadeInUp>

        <FadeInUp delay={100} style={{ gap: 8 }}>
          <Text style={styles.title}>Find a friend who fits your life</Text>
          <Text style={styles.subtitle}>Adopt, support or help a lost pet, all in one place.</Text>
        </FadeInUp>

        <View style={styles.perks}>
          {perks.map((p, i) => (
            <FadeInUp key={p.title} delay={180 + i * 60} style={styles.perk}>
              <View style={styles.emojiWrap}>
                <Text style={styles.emoji}>{p.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.perkTitle}>{p.title}</Text>
                <Text style={styles.perkText}>{p.text}</Text>
              </View>
            </FadeInUp>
          ))}
        </View>
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
  body: { flex: 1, paddingHorizontal: 20, gap: 20 },
  hero: {
    height: 250,
    borderRadius: 32,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginTop: 4,
  },
  sun: { position: 'absolute', top: 18, backgroundColor: 'rgba(255,255,255,0.55)' },
  side: { position: 'absolute', bottom: 0 },
  title: { fontFamily: fonts.extraBold, fontSize: 28, lineHeight: 34, color: colors.black },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.grey },
  perks: { gap: 14 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  emojiWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22, lineHeight: 28 },
  perkTitle: { fontFamily: fonts.semiBold, fontSize: 15, lineHeight: 21, color: colors.black },
  perkText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.grey },
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
