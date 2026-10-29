import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, NavHeader, PrimaryButton } from '@/components/ui';
import { Goal, useApp } from '@/store';
import { colors, fonts, shadow } from '@/theme';

const goals: { id: Goal; title: string; text?: string; icon: number; cta: string }[] = [
  {
    id: 'adopt',
    title: 'I want to adopt',
    text: 'Find your companion.',
    icon: require('../../../assets/figma/goal-adopt.svg'),
    cta: 'Continue to adoption',
  },
  {
    id: 'help',
    title: 'I want to help',
    text: 'Support a specific animal’s care.',
    icon: require('../../../assets/figma/goal-help.svg'),
    cta: 'Continue to support',
  },
  {
    id: 'found',
    title: 'I found a pet',
    text: 'Report a pet and ask for safe assistance.',
    icon: require('../../../assets/figma/goal-found.svg'),
    cta: 'Continue to report',
  },
  {
    id: 'explore',
    title: 'Just Exploring',
    icon: require('../../../assets/figma/goal-explore.svg'),
    cta: 'Continue',
  },
];

export default function GoalStep() {
  const { goal, setGoal } = useApp();
  const [selected, setSelected] = useState<Goal>(goal);
  const cta = goals.find((g) => g.id === selected)!.cta;

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Step 1/3" back={false} />
      <View style={styles.heading}>
        <Text style={styles.title}>What brings{'\n'}you here?</Text>
        <Text style={styles.subtitle}>Choose your goal.</Text>
      </View>

      <View style={styles.list}>
        {goals.map((goal) => {
          const active = goal.id === selected;
          return (
            <Pressable
              key={goal.id}
              onPress={() => setSelected(goal.id)}
              style={[styles.option, active && { backgroundColor: colors.purpleTint }]}
            >
              <View style={styles.optionIcon}>
                <Icon source={goal.icon} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.optionTitle}>{goal.title}</Text>
                {goal.text && <Text style={styles.optionText}>{goal.text}</Text>}
              </View>
              <View style={[styles.radio, active && { borderColor: colors.purple }]}>
                {active && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bottom}>
        <PrimaryButton
          title={cta}
          onPress={() => {
            setGoal(selected);
            router.push('/onboarding/create-account');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  heading: { alignItems: 'center', marginTop: 16, gap: 4 },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    lineHeight: 36,
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22, color: colors.grey },
  list: { paddingHorizontal: 16, gap: 12, marginTop: 40 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    ...shadow.card,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: { fontFamily: fonts.semiBold, fontSize: 18, lineHeight: 25, color: colors.black },
  optionText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.grey },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#49454F',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.purple },
  bottom: { marginTop: 'auto', paddingHorizontal: 20, paddingBottom: 8 },
});
