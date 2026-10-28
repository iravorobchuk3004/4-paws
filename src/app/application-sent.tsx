import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Celebration } from '@/components/Celebration';
import { Icon, PrimaryButton, SecondaryButton } from '@/components/ui';
import { colors, fonts } from '@/theme';

const steps = [
  {
    title: 'Application received',
    text: 'Today, 14:20',
    icon: require('../../assets/figma/step-done.svg'),
    dot: { backgroundColor: colors.purple },
    line: colors.purple,
  },
  {
    title: 'Shelter reviews your details',
    text: 'Expected contact within 2 working days.',
    icon: require('../../assets/figma/step-current.svg'),
    dot: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.purple },
    line: colors.greyBg,
  },
  {
    title: 'Agree a meeting together',
    text: 'The date is confirmed only after you speak with the shelter.',
    icon: require('../../assets/figma/step-next.svg'),
    dot: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.greyBg },
  },
];

export default function ApplicationSent() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 24 }}>
        <Celebration />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Application sent</Text>
        <View style={styles.timeline}>
          {steps.map((step, i) => (
            <View key={step.title} style={styles.step}>
              <View style={styles.marker}>
                <View style={[styles.dot, step.dot]}>
                  <Icon source={step.icon} size={16} />
                </View>
                {step.line && <View style={[styles.line, { backgroundColor: step.line }]} />}
              </View>
              <View style={[styles.stepText, i < steps.length - 1 && { paddingBottom: 20 }]}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepSub}>{step.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton title="View saved animals" onPress={() => router.replace('/(tabs)/my-pets')} />
        <SecondaryButton title="Back to home" onPress={() => router.replace('/(tabs)')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 40, gap: 24 },
  title: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.black, textAlign: 'center' },
  timeline: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  step: { flexDirection: 'row', gap: 12 },
  marker: { alignItems: 'center', gap: 4 },
  dot: { padding: 4, borderRadius: 100 },
  line: { flex: 1, width: 2 },
  stepText: { flex: 1, gap: 2 },
  stepTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  stepSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  bottom: { marginTop: 'auto', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 8 },
});
