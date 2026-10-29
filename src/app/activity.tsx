import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { Tag } from '@/components/PetRow';
import { Chip, Icon, NavHeader, SecondaryButton } from '@/components/ui';
import { euro, getCareNeed } from '@/data/care';
import { getProfile } from '@/data/profiles';
import { formatDate, useApp } from '@/store';
import { colors, fonts } from '@/theme';

const tabs = [
  { id: 'applications', label: 'Meetings' },
  { id: 'reports', label: 'Found pets' },
  { id: 'donations', label: 'Donations' },
] as const;
type Tab = (typeof tabs)[number]['id'];

// Everything the person has sent: meeting requests, found-pet cases and donations.
export default function Activity() {
  const params = useLocalSearchParams<{ tab?: Tab }>();
  const [tab, setTab] = useState<Tab>(params.tab ?? 'applications');
  const { applications, appliedAt, reports, donations } = useApp();

  const total = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="My activity" />
      <View style={styles.tabs}>
        {tabs.map((t) => (
          <Chip key={t.id} label={t.label} selected={tab === t.id} onPress={() => setTab(t.id)} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {tab === 'applications' &&
          (applications.length ? (
            [...applications].reverse().map((id, i) => {
              const pet = getProfile(id);
              return (
                <Row
                  key={id}
                  delay={i * 50}
                  photo={pet.thumb}
                  title={`Meeting ${pet.name}`}
                  text={`${pet.shelter} · ${appliedAt[id] ? formatDate(appliedAt[id]) : 'sent'}`}
                  tag={<Tag label="In review" tone="purple" />}
                  onPress={() => router.push(`/applications/${id}`)}
                />
              );
            })
          ) : (
            <Empty
              text="No meeting requests yet. When you find a pet you like, ask the shelter for a meeting."
              cta="Find pets"
              onPress={() => router.push('/browse')}
            />
          ))}

        {tab === 'reports' &&
          (reports.length ? (
            reports.map((r, i) => (
              <Row
                key={r.id}
                delay={i * 50}
                photo={r.photo ? { uri: r.photo } : require('../../assets/figma/found-photo.jpg')}
                title={`Found ${r.animal.toLowerCase()} · ${r.id}`}
                text={`${r.location} · ${formatDate(r.createdAt)}`}
                tag={<Tag label={r.resolved ? 'Closed' : 'Open'} tone={r.resolved ? 'grey' : 'purple'} />}
                onPress={() => router.push(`/reports/${r.id}`)}
              />
            ))
          ) : (
            <Empty
              text="You haven’t reported a found pet. If you see one that needs help, we’ll guide you."
              cta="Report a found pet"
              onPress={() => router.push('/found')}
            />
          ))}

        {tab === 'donations' &&
          (donations.length ? (
            <>
              <View style={styles.total}>
                <Text style={styles.totalLabel}>You’ve given</Text>
                <Text style={styles.totalValue}>{euro(total)}</Text>
              </View>
              {donations.map((d, i) => {
                const need = getCareNeed(d.id);
                return (
                  <Row
                    key={d.at}
                    delay={i * 50}
                    photo={need.photo}
                    title={`${euro(d.amount)} for ${need.name}`}
                    text={formatDate(d.at)}
                    onPress={() => router.push(`/donate/${need.id}`)}
                  />
                );
              })}
            </>
          ) : (
            <Empty
              text="No donations yet. Even a small gift helps pay for an animal’s food and vet care."
              cta="See who needs help"
              onPress={() => router.navigate('/(tabs)/support')}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  photo,
  title,
  text,
  tag,
  delay,
  onPress,
}: {
  photo: number | { uri: string };
  title: string;
  text: string;
  tag?: ReactNode;
  delay: number;
  onPress: () => void;
}) {
  return (
    <FadeInUp delay={delay}>
      <Pressable style={styles.row} onPress={onPress}>
        <Image source={photo} style={styles.photo} contentFit="cover" />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.text} numberOfLines={1}>
            {text}
          </Text>
        </View>
        {tag}
        <Icon source={require('../../assets/figma/set-chevron.svg')} size={20} />
      </Pressable>
    </FadeInUp>
  );
}

function Empty({ text, cta, onPress }: { text: string; cta: string; onPress: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🐾</Text>
      <Text style={styles.emptyText}>{text}</Text>
      <SecondaryButton title={cta} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 20, backgroundColor: colors.white },
  photo: { width: 52, height: 52, borderRadius: 12, backgroundColor: colors.greyBg },
  title: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  text: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  total: { padding: 16, borderRadius: 20, backgroundColor: colors.purple, gap: 2 },
  totalLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.purpleSelected },
  totalValue: { fontFamily: fonts.extraBold, fontSize: 28, color: colors.white },
  empty: { alignItems: 'center', gap: 16, paddingTop: 40, paddingHorizontal: 16 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.grey, textAlign: 'center' },
});
