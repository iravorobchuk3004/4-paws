import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, Icon, NavHeader, PageHeading, PrimaryButton } from '@/components/ui';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

type Question = {
  id: string;
  label: string;
  icon: number;
  options: string[];
  multi?: boolean;
};

const questions: Question[] = [
  {
    id: 'children',
    label: 'Children at home',
    icon: require('../../../assets/figma/q-users.svg'),
    options: ['Yes', 'No'],
  },
  {
    id: 'home',
    label: 'Your home',
    icon: require('../../../assets/figma/q-home.svg'),
    options: ['House', 'Apartment'],
  },
  {
    id: 'pets',
    label: 'Existing pets · select all that apply',
    icon: require('../../../assets/figma/q-paw.svg'),
    options: ['None', 'Cat', 'Dog', 'Other'],
    multi: true,
  },
  {
    id: 'activity',
    label: 'Your personality & activity',
    icon: require('../../../assets/figma/q-activity.svg'),
    options: ['Calm', 'Balanced', 'Active'],
  },
  {
    id: 'time',
    label: 'Daily time you can spend with a pet',
    icon: require('../../../assets/figma/q-clock.svg'),
    options: ['< 1 hour', '1–3 hours', '3+ hours'],
  },
];

export default function AboutYou() {
  // Opened from Profile to edit answers, or as the last onboarding step.
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const { preferences, setPreferences } = useApp();
  const [answers, setAnswers] = useState(preferences);

  const save = () => {
    setPreferences(answers);
    if (edit) {
      router.back();
    } else {
      router.push('/onboarding/ready');
    }
  };

  const toggle = (q: Question, option: string) => {
    setAnswers((prev) => {
      const current = prev[q.id] ?? [];
      if (!q.multi) return { ...prev, [q.id]: [option] };
      if (option === 'None') return { ...prev, [q.id]: ['None'] };
      const withoutNone = current.filter((o) => o !== 'None');
      const next = withoutNone.includes(option)
        ? withoutNone.filter((o) => o !== option)
        : [...withoutNone, option];
      return { ...prev, [q.id]: next };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step={edit === 'filters' ? 'Filters' : edit ? 'Preferences' : 'Step 3/3'} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <PageHeading
          title="A little about you"
          subtitle="Tell us about your life so we can recommend suitable pets."
        />
        <View style={styles.questions}>
          {questions.map((q) => (
            <View key={q.id} style={{ gap: 8 }}>
              <View style={styles.labelRow}>
                <Icon source={q.icon} />
                <Text style={styles.label}>{q.label}</Text>
              </View>
              <View style={styles.options}>
                {q.options.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    selected={answers[q.id]?.includes(option)}
                    onPress={() => toggle(q, option)}
                  />
                ))}
              </View>
            </View>
          ))}
          <Text style={styles.note}>
            You can edit these answers later. A meeting helps you find the right fit.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title={edit === 'filters' ? 'Update my matches' : edit ? 'Save preferences' : 'Show my matches'}
          onPress={save}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  questions: { paddingHorizontal: 16, gap: 20, marginTop: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 20, color: colors.black },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  note: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 17, color: colors.grey, marginTop: -4 },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
