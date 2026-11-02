import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/anim';
import { WigglingMascot } from '@/components/Celebration';
import { stories } from '@/data/pets';
import { Answers, lifestyle, onboardingQuiz, Option, QuizStep } from '@/data/quiz';
import { Goal, useApp } from '@/store';
import { colors, fonts } from '@/theme';

const ADVANCE_MS = 260;

// Headway-style onboarding: one question per screen, big tappable answers, a progress bar,
// and a few friendly breaks. With `edit` it becomes the Filters / Preferences flow.
export default function Quiz() {
  const { edit } = useLocalSearchParams<{ edit?: 'filters' | '1' }>();
  const { preferences, setPreferences, setGoal } = useApp();
  const steps = edit ? lifestyle : onboardingQuiz;

  // Editing starts from the person's own saved answers; a new person starts with nothing picked.
  const [answers, setAnswers] = useState<Answers>(() => (edit ? preferences : {}));
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const advancing = useRef(false);
  const step = steps[index];

  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(progress, {
      toValue: (index + 1) / steps.length,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [index, progress, steps.length]);

  // Only the lifestyle answers feed the matches; the goal and the "sounds like you" reaction don't.
  const finish = (final: Answers) => {
    setPreferences(Object.fromEntries(Object.entries(final).filter(([id]) => lifestyle.some((q) => q.id === id))));
    if (edit) return router.back();
    router.push('/onboarding/matching');
  };

  const next = (final = answers) => {
    advancing.current = false;
    if (index === steps.length - 1) return finish(final);
    setDirection(1);
    setIndex(index + 1);
  };

  // Skips the rest of the quiz; whatever was answered so far still shapes the matches.
  const skip = () => {
    if (advancing.current) return;
    if (!answers.goal) setGoal('adopt');
    finish(answers);
  };

  const back = () => {
    if (index === 0) return router.back();
    setDirection(-1);
    setIndex(index - 1);
  };

  const pick = (q: Extract<QuizStep, { type: 'question' }>, value: string) => {
    if (advancing.current) return;
    Haptics.selectionAsync().catch(() => {});

    if (q.multi) {
      setAnswers((prev) => {
        const current = (prev[q.id] ?? []).filter((v) => v !== q.exclusive);
        const list =
          value === q.exclusive
            ? [value]
            : current.includes(value)
              ? current.filter((v) => v !== value)
              : [...current, value];
        return { ...prev, [q.id]: list };
      });
      return;
    }

    const updated = { ...answers, [q.id]: [value] };
    setAnswers(updated);

    // The goal decides the route: only adopters go through the lifestyle questions.
    if (q.id === 'goal') {
      setGoal(value as Goal);
      if (value !== 'adopt') {
        advancing.current = true;
        setTimeout(() => {
          advancing.current = false;
          router.push('/onboarding/create-account');
        }, ADVANCE_MS);
        return;
      }
    }
    advancing.current = true;
    setTimeout(() => next(updated), ADVANCE_MS);
  };

  return (
    <SafeAreaView style={[styles.container, step.type === 'fact' && { backgroundColor: step.color }]}>
      <View style={styles.header}>
        <Pressable onPress={back} hitSlop={12} style={styles.back} accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={24} color={colors.black} />
        </Pressable>
        <View style={styles.track}>
          <Animated.View style={[styles.bar, { transform: [{ scaleX: progress }] }]} />
        </View>
        <Text style={styles.counter}>
          {index + 1}/{steps.length}
        </Text>
        {!edit && (
          <Pressable onPress={skip} hitSlop={10} style={styles.skip} accessibilityLabel="Skip the questions">
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>

      <StepIn key={step.id} direction={direction}>
        {step.type === 'question' && (
          <QuestionStep step={step} selected={answers[step.id] ?? []} onPick={(v) => pick(step, v)} />
        )}
        {step.type === 'fact' && <FactStep step={step} answers={answers} />}
        {step.type === 'proof' && <ProofStep />}
        {step.type === 'statement' && (
          <StatementStep
            statement={step.statement}
            selected={answers[step.id]?.[0]}
            onPick={(v) => {
              if (advancing.current) return;
              advancing.current = true;
              Haptics.selectionAsync().catch(() => {});
              const updated = { ...answers, [step.id]: [v] };
              setAnswers(updated);
              setTimeout(() => next(updated), ADVANCE_MS);
            }}
          />
        )}
      </StepIn>

      {step.type === 'question' && step.multi && (
        <View style={styles.bottom}>
          <ContinueButton
            title={edit && index === steps.length - 1 ? 'Update my matches' : 'Continue'}
            disabled={!answers[step.id]?.length}
            onPress={() => next()}
          />
        </View>
      )}
      {(step.type === 'fact' || step.type === 'proof') && (
        <View style={styles.bottom}>
          <ContinueButton title="Continue" dark={step.type === 'fact'} onPress={() => next()} />
        </View>
      )}
    </SafeAreaView>
  );
}

// Slides each new step in from the side it came from.
function StepIn({ direction, children }: { direction: number; children: React.ReactNode }) {
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [t]);
  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: t,
        transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [40 * direction, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}

function QuestionStep({
  step,
  selected,
  onPick,
}: {
  step: Extract<QuizStep, { type: 'question' }>;
  selected: string[];
  onPick: (value: string) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={styles.title}>{step.title}</Text>
      {step.subtitle && <Text style={styles.subtitle}>{step.subtitle}</Text>}
      <View style={styles.options}>
        {step.options.map((o, i) => (
          <OptionCard
            key={o.value}
            option={o}
            index={i}
            multi={!!step.multi}
            selected={selected.includes(o.value)}
            onPress={() => onPick(o.value)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function OptionCard({
  option,
  index,
  multi,
  selected,
  onPress,
}: {
  option: Option;
  index: number;
  multi: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 360, delay: 60 + index * 55, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [index, t]);

  return (
    <Animated.View style={{ opacity: t, transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }}>
      <PressableScale onPress={onPress} scaleTo={0.97} style={[styles.option, selected && styles.optionSelected]}>
        <View style={[styles.emojiWrap, selected && { backgroundColor: colors.white }]}>
          <Text style={styles.emoji}>{option.emoji}</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.optionLabel}>{option.label}</Text>
          {option.hint && <Text style={styles.optionHint}>{option.hint}</Text>}
        </View>
        <View style={[multi ? styles.box : styles.radio, selected && styles.checkOn]}>
          {selected && <Ionicons name="checkmark" size={16} color={colors.white} />}
        </View>
      </PressableScale>
    </Animated.View>
  );
}

function FactStep({ step, answers }: { step: Extract<QuizStep, { type: 'fact' }>; answers: Answers }) {
  return (
    <View style={styles.fact}>
      <View style={styles.factSun}>
        <WigglingMascot animal={step.mascot} width={190} height={190} />
      </View>
      <Text style={styles.factBig}>{step.big}</Text>
      <Text style={styles.factTitle}>{step.title}</Text>
      <Text style={styles.factText}>{step.text(answers)}</Text>
    </View>
  );
}

function ProofStep() {
  const story = stories[0];
  return (
    <ScrollView contentContainerStyle={[styles.body, { alignItems: 'center' }]}>
      <Text style={[styles.title, { textAlign: 'center' }]}>You’re in good company</Text>
      <Text style={styles.proofBig}>1,240</Text>
      <Text style={[styles.subtitle, { textAlign: 'center' }]}>families met their pet through 4 Paws this year</Text>
      <View style={styles.review}>
        <Text style={styles.stars}>★★★★★</Text>
        <Text style={styles.reviewText}>{story.quote}</Text>
        <View style={styles.reviewFooter}>
          <Image source={story.avatar} style={styles.reviewAvatar} />
          <Text style={styles.reviewName}>{story.names}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const reactions = [
  { value: 'no', emoji: '👎', label: 'Not me' },
  { value: 'maybe', emoji: '🤔', label: 'Not sure' },
  { value: 'yes', emoji: '👍', label: 'That’s me' },
];

function StatementStep({ statement, selected, onPick }: { statement: string; selected?: string; onPick: (v: string) => void }) {
  return (
    <View style={styles.body}>
      <Text style={styles.title}>Does this sound like you?</Text>
      <View style={styles.quote}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={styles.quoteText}>{statement}</Text>
      </View>
      <View style={styles.reactions}>
        {reactions.map((r) => (
          <PressableScale
            key={r.value}
            onPress={() => onPick(r.value)}
            style={[styles.reaction, selected === r.value && styles.optionSelected]}
          >
            <Text style={styles.reactionEmoji}>{r.emoji}</Text>
            <Text style={styles.reactionLabel}>{r.label}</Text>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

function ContinueButton({
  title,
  onPress,
  disabled,
  dark,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  dark?: boolean;
}) {
  return (
    <PressableScale
      onPress={disabled ? undefined : onPress}
      style={[styles.cta, dark && { backgroundColor: colors.black }, disabled && styles.ctaDisabled]}
    >
      <Text style={styles.ctaText}>{title}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, height: 48 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(27,27,27,0.08)', overflow: 'hidden' },
  bar: { flex: 1, borderRadius: 3, backgroundColor: colors.purple, transformOrigin: 'left' },
  skip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.7)' },
  skipText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.black },
  counter: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.grey, minWidth: 32, textAlign: 'right' },
  body: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, gap: 8 },
  title: { fontFamily: fonts.extraBold, fontSize: 28, lineHeight: 34, color: colors.black },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.grey },
  options: { gap: 12, marginTop: 20 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 68,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.white,
  },
  optionSelected: { borderColor: colors.purple, backgroundColor: colors.purpleTint },
  emojiWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 24, lineHeight: 30 },
  optionLabel: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 22, color: colors.black },
  optionHint: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.grey },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.greyOption, alignItems: 'center', justifyContent: 'center' },
  box: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: colors.greyOption, alignItems: 'center', justifyContent: 'center' },
  checkOn: { borderColor: colors.purple, backgroundColor: colors.purple },
  fact: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 6 },
  factSun: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  factBig: { fontFamily: fonts.extraBold, fontSize: 48, lineHeight: 56, color: colors.black },
  factTitle: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, color: colors.black, textAlign: 'center' },
  factText: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.black, textAlign: 'center', opacity: 0.7, marginTop: 6 },
  proofBig: { fontFamily: fonts.extraBold, fontSize: 64, lineHeight: 72, color: colors.purple, marginTop: 24 },
  review: { alignSelf: 'stretch', marginTop: 28, padding: 18, gap: 10, borderRadius: 20, backgroundColor: colors.white },
  stars: { fontSize: 18, color: '#F5B301', letterSpacing: 2 },
  reviewText: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.black },
  reviewFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewAvatar: { width: 28, height: 28, borderRadius: 14 },
  reviewName: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.grey },
  quote: { marginTop: 28, padding: 24, borderRadius: 24, backgroundColor: colors.yellowSoft },
  quoteMark: { fontFamily: fonts.extraBold, fontSize: 56, lineHeight: 56, color: colors.purple },
  quoteText: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 30, color: colors.black },
  reactions: { flexDirection: 'row', gap: 10, marginTop: 28 },
  reaction: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.white,
  },
  reactionEmoji: { fontSize: 30, lineHeight: 38 },
  reactionLabel: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.black },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  cta: { height: 56, borderRadius: 100, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  ctaDisabled: { backgroundColor: colors.greyOption },
  ctaText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.white },
});
