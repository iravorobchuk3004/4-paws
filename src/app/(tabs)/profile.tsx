import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Fragment } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    title: 'My activity',
    text: 'Meeting requests · found pets · donations',
    icon: require('../../../assets/figma/heart-purple.svg'),
    onPress: () => router.push('/activity'),
  },
  {
    title: 'Adoption preferences',
    text: 'Lifestyle & ideal companion',
    icon: require('../../../assets/figma/set-paw.svg'),
    onPress: () => router.push('/filters'),
  },
  {
    title: 'Notifications',
    text: 'Meeting updates · shelter news',
    icon: require('../../../assets/figma/set-bell.svg'),
    onPress: () => router.push('/settings/notifications'),
  },
  {
    title: 'Help & privacy',
    text: 'Support · safety · account settings',
    icon: require('../../../assets/figma/set-shield.svg'),
    onPress: () => router.push('/settings/help'),
  },
];

export default function Profile() {
  const { saved, applications, reports, user, setUser } = useApp();
  const initials = (user?.name ?? '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const logOut = () =>
    Alert.alert('Log out?', 'Your saved animals stay on this phone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          setUser(null);
          router.replace('/welcome');
        },
      },
    ]);
  const meeting = applications.length ? getProfile(applications[applications.length - 1]) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={0} style={{ gap: 4 }}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Profile</Text>
            {user && (
              <Pressable style={styles.logout} onPress={logOut} hitSlop={8}>
                <Icon source={require('../../../assets/figma/logout.svg')} size={20} />
                <Text style={styles.logoutText}>Log out</Text>
              </Pressable>
            )}
          </View>
          <Text style={styles.subtitle}>You & your next friend</Text>
        </FadeInUp>

        <FadeInUp delay={70} style={[card, styles.profile]}>
          {user ? (
            <>
              <Pressable style={[styles.avatar, styles.initials]} onPress={() => router.push('/settings/account')}>
                {user.photo ? (
                  <Image source={{ uri: user.photo }} style={StyleSheet.absoluteFill} contentFit="cover" />
                ) : (
                  <Text style={styles.initialsText}>{initials || '🐾'}</Text>
                )}
              </Pressable>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
              </View>
              <Pressable style={styles.edit} onPress={() => router.push('/settings/account')}>
                <Icon source={require('../../../assets/figma/edit.svg')} size={16} />
                <Text style={styles.editText}>Edit</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={[styles.avatar, styles.initials]}>
                <Text style={styles.initialsText}>🐾</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.name}>Browsing as a guest</Text>
                <Text style={styles.email}>Create an account to request meetings</Text>
              </View>
              <Pressable style={styles.edit} onPress={() => router.push('/onboarding/quiz')}>
                <Text style={styles.editText}>Join</Text>
              </Pressable>
            </>
          )}
        </FadeInUp>

        <FadeInUp delay={140} style={styles.stats}>
          <Stat value={saved.length} label="Saved" color={colors.pinkLight} />
          <Stat value={applications.length} label={applications.length === 1 ? 'Application' : 'Applications'} color={colors.limeSoft} />
          <Stat value={reports.length} label={reports.length === 1 ? 'Pet helped' : 'Pets helped'} color={colors.yellowSoft} />
        </FadeInUp>

        {meeting && (
          <FadeInUp delay={210}>
            <Pressable style={styles.meeting} onPress={() => router.push(`/applications/${meeting.id}`)}>
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

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={[styles.stat, { backgroundColor: color }]}>
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
  initials: { overflow: 'hidden', backgroundColor: colors.purpleSelected, alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontFamily: fonts.bold, fontSize: 22, color: colors.purple },
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
  stat: { flex: 1, padding: 12, borderRadius: 20 },
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
