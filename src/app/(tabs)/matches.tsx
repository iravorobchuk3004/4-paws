import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { PetRow, Tag } from '@/components/PetRow';
import { Chip, NavHeader } from '@/components/ui';
import { ageInYears, PetProfile, profiles } from '@/data/profiles';
import { matchScore } from '@/lib/match';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const sorts = ['Best match', 'Nearest', 'Newest', 'Age'];

export default function Matches() {
  const [sort, setSort] = useState('Best match');
  const { preferences } = useApp();
  const scored = profiles.map((p) => ({ ...p, match: matchScore(p, preferences) }));

  const sorted = scored.sort((a, b) => {
    if (sort === 'Nearest') return parseFloat(a.distance) - parseFloat(b.distance);
    if (sort === 'Age') return ageInYears(a.age) - ageInYears(b.age);
    if (sort === 'Newest') return a.addedDaysAgo - b.addedDaysAgo;
    return b.match - a.match;
  });
  const strong = sorted.filter((p) => p.match >= 88);
  const possible = sorted.filter((p) => p.match < 88);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <NavHeader location="Hamburg · 25 km" />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={0} style={{ gap: 8 }}>
          <Text style={styles.title}>Your matches</Text>
          <Text style={styles.subtitle}>
            {profiles.length} animals to get to know, based on your lifestyle answers.
          </Text>
        </FadeInUp>

        <FadeInUp delay={70} style={styles.sorts}>
          {sorts.map((s) => (
            <Chip key={s} label={s} selected={sort === s} onPress={() => setSort(s)} />
          ))}
        </FadeInUp>

        <FadeInUp delay={140}>
          <Group title="Strong fit" pets={strong} />
        </FadeInUp>
        <FadeInUp delay={210}>
          <Group title="Possible fit" pets={possible} />
        </FadeInUp>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group({ title, pets }: { title: string; pets: PetProfile[] }) {
  if (!pets.length) return null;
  return (
    <View style={{ gap: 12 }}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupTitle}>{title}</Text>
        <Text style={styles.count}>
          {pets.length} {pets.length === 1 ? 'pet' : 'pets'}
        </Text>
      </View>
      {pets.map((pet) => (
        <PetRow
          key={pet.id}
          pet={pet}
          photo={pet.thumb}
          note={pet.note}
          onPress={() => router.push(`/pet/${pet.id}`)}
        >
          <Tag label={`${pet.match}% match`} />
          {pet.urgent && <Tag label="Urgent" tone="purple" />}
        </PetRow>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 220, gap: 24 },
  title: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.black },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22, color: colors.grey },
  sorts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  groupTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  count: { fontFamily: fonts.medium, fontSize: 13, color: colors.purple },
});
