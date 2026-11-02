import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { Celebration } from '@/components/Celebration';
import { TreatCatch } from '@/components/TreatCatch';
import { PrimaryButton } from '@/components/ui';
import { profiles } from '@/data/profiles';
import { matchScore } from '@/lib/match';
import { enterApp } from '@/lib/onboarding';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const TOTAL_MS = 9000;
const TICK_MS = 60;
const QUESTION_AT = 55;

const checks = [
  { at: 30, text: 'Reading your answers' },
  { at: 65, text: 'Checking 3 shelters near Hamburg' },
  { at: 100, text: 'Finding pets who’d love your home' },
];

// "Building your plan" moment from Headway: a progress count-up with a checklist,
// one quick question halfway, and a treat-catching game to play while it loads.
export default function Matching() {
  const { preferences, user, goal, addTreats } = useApp();
  const [percent, setPercent] = useState(0);
  const [asking, setAsking] = useState(false);
  const [bones, setBones] = useState(0);
  const banked = useRef(false);
  // The loop keeps its own copy of the progress, so pausing for the question never loses or repeats it.
  const progress = useRef({ percent: 0, asked: false });
  const done = percent >= 100;

  useEffect(() => {
    if (done || asking) return;
    const timer = setInterval(() => {
      const p = progress.current;
      p.percent = Math.min(100, p.percent + (100 * TICK_MS) / TOTAL_MS);
      setPercent(p.percent);
      if (!p.asked && p.percent >= QUESTION_AT) {
        p.asked = true;
        setAsking(true);
      }
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [done, asking]);

  useEffect(() => {
    if (!done || banked.current) return;
    banked.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (bones) addTreats(bones);
  }, [done, bones, addTreats]);

  const top = profiles
    .map((p) => ({ ...p, match: matchScore(p, preferences) }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);
  const great = profiles.filter((p) => matchScore(p, preferences) >= 85).length;

  const answer = () => {
    Haptics.selectionAsync().catch(() => {});
    setAsking(false);
  };

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.result}>
          <Celebration />
          <FadeInUp style={{ alignItems: 'center', gap: 8 }}>
            <Text style={styles.title}>We found {great} great matches!</Text>
            <Text style={styles.text}>Here are the pets who’d fit your life best.</Text>
          </FadeInUp>
          <FadeInUp delay={150} style={styles.fan}>
            {top.map((p, i) => (
              <View
                key={p.id}
                style={[styles.fanCard, { transform: [{ rotate: `${(i - 1) * 8}deg` }, { translateY: i === 1 ? -12 : 0 }], zIndex: i === 1 ? 2 : 1 }]}
              >
                <Image source={p.thumb} style={styles.fanPhoto} contentFit="cover" />
                <Text style={styles.fanName}>{p.name}</Text>
                <Text style={styles.fanMatch}>{p.match}% match</Text>
              </View>
            ))}
          </FadeInUp>
          {bones > 0 && (
            <FadeInUp delay={300} style={styles.banked}>
              <Text style={styles.bankedText}>🦴 {bones} bones added to the meal jar for shelter pets</Text>
            </FadeInUp>
          )}
        </View>
        <View style={styles.bottom}>
          <PrimaryButton
            title={user ? 'Show my matches' : 'Save my matches'}
            onPress={() => (user ? enterApp(goal) : router.push('/onboarding/create-account'))}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.percent}>{Math.floor(percent)}%</Text>
        <Text style={styles.title}>Finding your matches…</Text>
        <View style={styles.track}>
          <View style={[styles.bar, { width: `${percent}%` }]} />
        </View>
        <View style={styles.checks}>
          {checks.map((c) => {
            const ok = percent >= c.at;
            return (
              <View key={c.text} style={styles.check}>
                <Ionicons
                  name={ok ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={ok ? colors.purple : colors.grey1}
                />
                <Text style={[styles.checkText, ok && { color: colors.black }]}>{c.text}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.game}>
        <View style={styles.gameHead}>
          <Text style={styles.gameTitle}>Catch the bones while you wait</Text>
          <Text style={styles.gameScore}>🦴 {bones}</Text>
        </View>
        <TreatCatch running={!asking} height={200} onCatch={(n) => setBones((b) => b + n)} />
        <Text style={styles.gameHint}>Every bone goes to the meal jar for shelter pets.</Text>
      </View>

      {/* An in-screen overlay rather than a native Modal, so its buttons always get the taps. */}
      {asking && (
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetLabel}>Quick question</Text>
            <Text style={styles.sheetTitle}>Would you like to meet a pet in person this month?</Text>
            <View style={styles.sheetRow}>
              <Pressable onPress={answer} style={[styles.sheetButton, styles.sheetNo]} hitSlop={6}>
                <Text style={[styles.sheetButtonText, { color: colors.black }]}>Not yet</Text>
              </Pressable>
              <Pressable onPress={answer} style={styles.sheetButton} hitSlop={6}>
                <Text style={styles.sheetButtonText}>Yes!</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 24, paddingTop: 32, alignItems: 'center', gap: 8 },
  percent: { fontFamily: fonts.extraBold, fontSize: 64, lineHeight: 72, color: colors.purple },
  title: { fontFamily: fonts.extraBold, fontSize: 24, lineHeight: 30, color: colors.black, textAlign: 'center' },
  text: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.grey, textAlign: 'center' },
  track: { alignSelf: 'stretch', height: 8, borderRadius: 4, backgroundColor: colors.purpleTint, overflow: 'hidden', marginTop: 12 },
  bar: { height: '100%', borderRadius: 4, backgroundColor: colors.purple },
  checks: { alignSelf: 'stretch', gap: 12, marginTop: 20 },
  check: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkText: { fontFamily: fonts.medium, fontSize: 15, color: colors.grey },
  game: { marginTop: 'auto', paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  gameHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gameTitle: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.black },
  gameScore: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.purple },
  gameHint: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey, textAlign: 'center' },
  result: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, gap: 16 },
  fan: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  fanCard: { width: 108, marginHorizontal: -6, padding: 6, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', gap: 2 },
  fanPhoto: { width: 96, height: 110, borderRadius: 14 },
  fanName: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black, marginTop: 4 },
  fanMatch: { fontFamily: fonts.bold, fontSize: 12, color: colors.purple, marginBottom: 4 },
  banked: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 100, backgroundColor: colors.limeSoft },
  bankedText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.black },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'rgba(27,27,27,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: { padding: 24, borderRadius: 28, backgroundColor: colors.white, gap: 12 },
  sheetLabel: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.purple },
  sheetTitle: { fontFamily: fonts.extraBold, fontSize: 22, lineHeight: 28, color: colors.black },
  sheetRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  sheetButton: { flex: 1, height: 52, borderRadius: 100, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  sheetNo: { backgroundColor: colors.greyBg },
  sheetButtonText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.white },
});
