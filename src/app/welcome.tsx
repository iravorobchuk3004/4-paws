import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, PrimaryButton, SecondaryButton } from '@/components/ui';
import { colors, fonts } from '@/theme';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Image
            source={require('../../assets/figma/welcome-hero.png')}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(98,82,206,0.08)' }]} />
          <View style={styles.heroTop}>
            <View style={styles.badge}>
              <Icon source={require('../../assets/figma/heart-purple.svg')} size={16} />
              <Text style={styles.badgeText}>Adopt. Support. Repeat.</Text>
            </View>
            <View style={styles.iconWrap}>
              <Icon source={require('../../assets/figma/bone-purple.svg')} size={18} />
            </View>
          </View>
        </View>

        <View style={styles.copy}>
          <Text style={styles.title}>Welcome to 4 Paws</Text>
          <Text style={styles.subtitle}>
            Discover pets, support shelters, and start your adoption journey with one tap.
          </Text>
        </View>

        <View style={styles.actions}>
          <QuickAction
            label="Search pets"
            icon={require('../../assets/figma/search-white.svg')}
            iconSize={24}
            onPress={() => router.push('/(tabs)')}
          />
          <QuickAction
            label="Support pets"
            icon={require('../../assets/figma/heart-white.svg')}
            iconSize={18}
            onPress={() => router.push('/onboarding/goal')}
          />
        </View>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton
          title="Get started"
          icon={require('../../assets/figma/arrow-right-white.svg')}
          onPress={() => router.push('/onboarding/goal')}
        />
        <SecondaryButton title="Explore pets" onPress={() => router.push('/(tabs)')} />
      </View>
    </SafeAreaView>
  );
}

function QuickAction({
  label,
  icon,
  iconSize,
  onPress,
}: {
  label: string;
  icon: number;
  iconSize: number;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Icon source={icon} size={iconSize} />
      </View>
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, paddingHorizontal: 16, paddingVertical: 24, gap: 24, alignItems: 'center' },
  hero: { height: 220, alignSelf: 'stretch', borderRadius: 24, overflow: 'hidden', padding: 20 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  badgeText: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 22, color: colors.black },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { gap: 8, alignItems: 'center' },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    lineHeight: 40,
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    color: colors.grey,
    textAlign: 'center',
  },
  actions: { flexDirection: 'row', gap: 12, alignSelf: 'stretch' },
  action: {
    flex: 1,
    height: 96,
    padding: 14,
    gap: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { fontFamily: fonts.bold, fontSize: 15, color: colors.black },
  bottom: { paddingHorizontal: 20, gap: 8, paddingBottom: 8 },
});
