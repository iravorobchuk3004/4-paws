import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import { colors, fonts } from '@/theme';

export type TimelineStep = { title: string; text: string; state: 'done' | 'current' | 'next' };

const icons = {
  done: require('../../assets/figma/step-done.svg'),
  current: require('../../assets/figma/step-current.svg'),
  next: require('../../assets/figma/step-next.svg'),
};

const dots = {
  done: { backgroundColor: colors.purple },
  current: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.purple },
  next: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.greyBg },
};

// Vertical progress list used for application and found-pet case status.
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <View>
      {steps.map((step, i) => (
        <View key={step.title} style={styles.step}>
          <View style={styles.marker}>
            <View style={[styles.dot, dots[step.state]]}>
              <Icon source={icons[step.state]} size={16} />
            </View>
            {i < steps.length - 1 && (
              <View style={[styles.line, { backgroundColor: step.state === 'done' ? colors.purple : colors.greyBg }]} />
            )}
          </View>
          <View style={[styles.text, i < steps.length - 1 && { paddingBottom: 20 }]}>
            <Text style={[styles.title, step.state === 'next' && { color: colors.grey }]}>{step.title}</Text>
            <Text style={styles.sub}>{step.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', gap: 12 },
  marker: { alignItems: 'center' },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, width: 2, marginVertical: 2 },
  text: { flex: 1, gap: 2, paddingTop: 3 },
  title: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.black },
  sub: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.grey },
});
