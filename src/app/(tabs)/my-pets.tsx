import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { PetRow, Tag } from '@/components/PetRow';
import { Chip, Icon, SecondaryButton } from '@/components/ui';
import { getProfile, PetProfile } from '@/data/profiles';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

// Shelter-side availability for the sample animals.
const availability: Record<string, { label: string; tone: 'grey' | 'pink' }> = {
  milo: { label: 'Paused · update pending', tone: 'pink' },
};

export default function SavedAnimals() {
  const { saved, applications } = useApp();
  const [filter, setFilter] = useState<'all' | 'dog' | 'cat'>('all');

  const pets = saved.map(getProfile);
  const count = (kind: PetProfile['kind']) => pets.filter((p) => p.kind === kind).length;
  const visible = filter === 'all' ? pets : pets.filter((p) => p.kind === filter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={0} style={{ gap: 8 }}>
          <Text style={styles.title}>Saved animals</Text>
          <Text style={styles.subtitle}>{pets.length} saved · a little space to think</Text>
        </FadeInUp>

        <FadeInUp delay={70} style={styles.filters}>
          <Chip label={`All · ${pets.length}`} selected={filter === 'all'} onPress={() => setFilter('all')} />
          <Chip label={`Dogs · ${count('dog')}`} selected={filter === 'dog'} onPress={() => setFilter('dog')} />
          <Chip label={`Cats · ${count('cat')}`} selected={filter === 'cat'} onPress={() => setFilter('cat')} />
        </FadeInUp>

        <FadeInUp delay={140} style={{ gap: 12 }}>
          {visible.map((pet) => {
            const requested = applications.includes(pet.id);
            const status = availability[pet.id];
            return (
              <PetRow
                key={pet.id}
                pet={pet}
                photo={pet.savedThumb}
                onPress={() => router.push(`/pet/${pet.id}`)}
              >
                {requested ? (
                  <>
                    <Tag label="Meeting requested" tone="purple" />
                    <View style={{ flex: 1 }} />
                    <Text style={styles.link} onPress={() => router.push(`/applications/${pet.id}`)}>
                      View status
                    </Text>
                  </>
                ) : (
                  <Tag label={status?.label ?? 'Available to meet'} tone={status?.tone ?? 'grey'} />
                )}
              </PetRow>
            );
          })}
          {!visible.length && <Text style={styles.empty}>Nothing saved here yet.</Text>}
        </FadeInUp>

        <FadeInUp delay={210} style={styles.note}>
          <Icon source={require('../../../assets/figma/info.svg')} size={20} />
          <Text style={styles.noteText}>
            Availability can change. Open a profile to check the latest status before you visit.
          </Text>
        </FadeInUp>

        <SecondaryButton title="Explore more animals" onPress={() => router.navigate('/(tabs)')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 140, gap: 24 },
  title: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.black },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22, color: colors.grey },
  filters: { flexDirection: 'row', gap: 8 },
  link: { fontFamily: fonts.medium, fontSize: 12, color: colors.purple },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.purpleTint,
  },
  noteText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.black },
});
