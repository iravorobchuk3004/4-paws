import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { Celebration } from '@/components/Celebration';
import { PrimaryButton } from '@/components/ui';
import { enterApp } from '@/lib/onboarding';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const next = {
  adopt: { text: 'Your matches are ready. Save the ones you like and request a meeting when you feel sure.', cta: 'Show my matches' },
  help: { text: 'Pick an animal’s care fund and follow their progress. Every euro goes to their care.', cta: 'See who needs help' },
  found: { text: 'Let’s get the found pet some help. It takes about two minutes.', cta: 'Report the found pet' },
  explore: { text: 'Look around at your own pace. Save animals with the heart to find them again later.', cta: 'Start exploring' },
};

// Last onboarding step: a welcome, a notification opt-in and the way into the app.
export default function Ready() {
  const { user, goal, notifications, setNotifications } = useApp();
  const firstName = user?.name.split(' ')[0];
  const copy = next[goal];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Celebration />
        <FadeInUp delay={200} style={{ gap: 8 }}>
          <Text style={styles.title}>You’re all set{firstName ? `, ${firstName}` : ''}!</Text>
          <Text style={styles.text}>{copy.text}</Text>
        </FadeInUp>

        <FadeInUp delay={350} style={styles.card}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.cardTitle}>Keep me posted</Text>
            <Text style={styles.cardText}>Get a notification when a shelter replies to you.</Text>
          </View>
          <Switch
            value={notifications.meetings}
            onValueChange={(meetings) => setNotifications({ meetings })}
            trackColor={{ true: colors.purple, false: colors.greyOption }}
          />
        </FadeInUp>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton title={copy.cta} onPress={() => enterApp(goal)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { flex: 1, justifyContent: 'center', paddingHorizontal: 16, gap: 24 },
  title: { fontFamily: fonts.extraBold, fontSize: 28, lineHeight: 36, color: colors.black, textAlign: 'center' },
  text: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23, color: colors.grey, textAlign: 'center' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  cardTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  cardText: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  bottom: { paddingHorizontal: 20, paddingBottom: 8 },
});
