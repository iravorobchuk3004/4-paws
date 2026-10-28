import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { Icon } from '@/components/ui';
import { getProfile } from '@/data/profiles';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const card = {
  backgroundColor: colors.white,
  borderRadius: 20,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

const settings = [
  {
    title: 'Adoption preferences',
    text: 'Lifestyle & ideal companion',
    icon: require('../../../assets/figma/set-paw.svg'),
    onPress: () => router.push('/onboarding/about-you'),
  },
  {
    title: 'Notifications',
    text: 'Meeting updates · shelter news',
    icon: require('../../../assets/figma/set-bell.svg'),
  },
  {
    title: 'Help & privacy',
    text: 'Support · safety · account settings',
    icon: require('../../../assets/figma/set-shield.svg'),
  },
];

export default function Profile() {
  const { saved, applications } = useApp();
  const meeting = applications.length ? getProfile(applications[applications.length - 1]) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={0} style={{ gap: 4 }}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Profile</Text>
            <Pressable style={styles.logout} onPress={() => router.replace('/welcome')}>
              <Icon source={require('../../../assets/figma/logout.svg')} size={20} />
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
          </View>
          <Text style={styles.subtitle}>You & your next friend</Text>
        </FadeInUp>

        <FadeInUp delay={70} style={[card, styles.profile]}>
          <Image source={require('../../../assets/figma/profile-avatar.png')} style={styles.avatar} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.name}>Anna Kovalenko</Text>
            <Text style={styles.email}>anna@example.com</Text>
          </View>
          <Pressable style={styles.edit}>
            <Icon source={require('../../../assets/figma/edit.svg')} size={16} />
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </FadeInUp>

        <FadeInUp delay={140} style={styles.stats}>
          <Stat value={saved.length} label="Saved" />
          <Stat value={applications.length} label={applications.length === 1 ? 'Application' : 'Applications'} />
          <Stat value={0} label="Adopted" />
        </FadeInUp>

        {meeting && (
          <FadeInUp delay={210}>
            <Pressable style={styles.meeting} onPress={() => router.push(`/pet/${meeting.id}`)}>
              <Image source={meeting.thumb} style={styles.meetingPhoto} contentFit="cover" />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.meetingTitle}>Your meeting with {meeting.name}</Text>
                <Text style={styles.meetingText}>Application sent · Awaiting review</Text>
              </View>
              <Icon source={require('../../../assets/figma/chevron-right-purple.svg')} size={20} />
            </Pressable>
          </FadeInUp>
        )}

        <FadeInUp delay={280} style={{ gap: 12 }}>
          <Text style={styles.sectionTitle}>Your account</Text>
          <View style={[card, styles.settings]}>
            {settings.map((s, i) => (
              <Fragment key={s.title}>
                {i > 0 && <View style={styles.divider} />}
                <Pressable style={styles.row} onPress={s.onPress}>
                  <View style={styles.rowIcon}>
                    <Icon source={s.icon} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.rowTitle}>{s.title}</Text>
                    <Text style={styles.rowText}>{s.text}</Text>
                  </View>
                  <Icon source={require('../../../assets/figma/set-chevron.svg')} size={20} />
                </Pressable>
              </Fragment>
            ))}
          </View>
        </FadeInUp>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={[card, styles.stat]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 140, gap: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.black },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.grey },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoutText: { fontFamily: fonts.medium, fontSize: 14, color: colors.grey },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  name: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  email: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: colors.greyBg,
  },
  editText: { fontFamily: fonts.regular, fontSize: 14, color: colors.black },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, padding: 12 },
  statValue: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  statLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  meeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.purpleTint,
  },
  meetingPhoto: { width: 56, height: 56, borderRadius: 8 },
  meetingTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  meetingText: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  settings: { paddingHorizontal: 16, paddingVertical: 4 },
  divider: { height: 1, backgroundColor: colors.greyBg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowIcon: { padding: 8, borderRadius: 100, backgroundColor: colors.purpleTint },
  rowTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  rowText: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
});
