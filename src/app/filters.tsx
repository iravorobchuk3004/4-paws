import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/anim';
import { Chip, NavHeader } from '@/components/ui';
import { Answers, lifestyle } from '@/data/quiz';
import { profiles } from '@/data/profiles';
import { matchScore } from '@/lib/match';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const titles: Record<string, string> = {
  kind: 'Who you’d like to meet',
  home: 'Your home',
  activity: 'Your days',
  time: 'Time for a pet each day',
  children: 'Children at home',
  pets: 'Pets at home',
};

// Classic one-page filters with the same answers as the quiz. Only what the person picked
// (in the quiz or here) is selected; nothing is pre-picked for someone who skipped it.
export default function Filters() {
  const { preferences, setPreferences } = useApp();
  const [answers, setAnswers] = useState<Answers>(preferences);
  const strong = profiles.filter((p) => matchScore(p, answers) >= 85).length;
  const any = Object.values(answers).some((a) => a.length);

  const toggle = (id: string, value: string, multi?: boolean, exclusive?: string) =>
    setAnswers((prev) => {
      const current = prev[id] ?? [];
      // Tapping the selected option again clears it, so single choices can be undone too.
      if (!multi) return { ...prev, [id]: current.includes(value) ? [] : [value] };
      if (value === exclusive) return { ...prev, [id]: current.includes(value) ? [] : [value] };
      const rest = current.filter((v) => v !== exclusive);
      return { ...prev, [id]: rest.includes(value) ? rest.filter((v) => v !== value) : [...rest, value] };
    });

  const apply = () => {
    setPreferences(Object.fromEntries(Object.entries(answers).filter(([, v]) => v.length)));
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Filters" />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Filters</Text>
          {any && (
            <Pressable onPress={() => setAnswers({})} hitSlop={10}>
              <Text style={styles.clear}>Clear all</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.subtitle}>Tell us a bit about your life and we’ll sort pets by how well they fit.</Text>

        {lifestyle.map((q) =>
          q.type === 'question' ? (
            <View key={q.id} style={styles.group}>
              <Text style={styles.groupTitle}>
                {titles[q.id]}
                {q.multi ? <Text style={styles.groupHint}>  · pick any</Text> : null}
              </Text>
              <View style={styles.chips}>
                {q.options.map((o) => (
                  <Chip
                    key={o.value}
                    variant="outline"
                    label={`${o.emoji}  ${o.label}`}
                    selected={answers[q.id]?.includes(o.value)}
                    onPress={() => toggle(q.id, o.value, q.multi, q.exclusive)}
                  />
                ))}
              </View>
            </View>
          ) : null,
        )}
      </ScrollView>

      <View style={styles.bottom}>
        <PressableScale onPress={apply} style={styles.cta}>
          <Text style={styles.ctaText}>{any ? `Show my matches · ${strong} great fits` : 'Show all pets'}</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.extraBold, fontSize: 28, lineHeight: 34, color: colors.black },
  clear: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.purple },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.grey },
  group: { gap: 10, marginTop: 16 },
  groupTitle: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.black },
  groupHint: { fontFamily: fonts.regular, fontSize: 13, color: colors.grey },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  cta: { height: 56, borderRadius: 100, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.white },
});
