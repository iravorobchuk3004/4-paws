import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { Tag } from '@/components/PetRow';
import { Progress } from '@/components/Progress';
import { Chip } from '@/components/ui';
import { careNeeds, euro } from '@/data/care';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const filters = ['Urgent first', 'All needs', 'Near me'];

export default function Support() {
  const { donated } = useApp();
  const [filter, setFilter] = useState('Urgent first');

  const list = [...careNeeds].sort((a, b) => {
    if (filter === 'Urgent first') return Number(!!b.urgent) - Number(!!a.urgent);
    if (filter === 'Near me') return a.distanceKm - b.distanceKm;
    return 0;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={0} style={{ gap: 8 }}>
          <Text style={styles.title}>Help a furry friend</Text>
          <Text style={styles.subtitle}>Choose a pet and see exactly what your help pays for.</Text>
        </FadeInUp>

        <FadeInUp delay={70} style={styles.filters}>
          {filters.map((f) => (
            <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </FadeInUp>

        <FadeInUp delay={140} style={{ gap: 12 }}>
          {list.map((c) => {
            const raised = c.raised + (donated[c.id] ?? 0);
            return (
              <View key={c.id} style={styles.card}>
                <View style={styles.top}>
                  <Image source={c.photo} style={styles.photo} contentFit="cover" />
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{c.name}</Text>
                      <Tag label={c.tag} tone={c.urgent ? 'pink' : 'purple'} />
                    </View>
                    <Text style={styles.meta}>
                      {c.need} · {c.shelter}
                    </Text>
                  </View>
                </View>
                <Progress value={raised / c.goal} />
                <View style={styles.amountRow}>
                  <Text style={styles.raised}>{euro(raised)} raised</Text>
                  <Text style={styles.goal}>of {euro(c.goal)}</Text>
                </View>
                <Pressable style={styles.button} onPress={() => router.push(`/donate/${c.id}`)}>
                  <Text style={styles.buttonText}>Support {c.name}</Text>
                </Pressable>
              </View>
            );
          })}
        </FadeInUp>
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
  card: { padding: 12, gap: 12, borderRadius: 20, backgroundColor: colors.white },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: { width: 64, height: 64, borderRadius: 8, backgroundColor: colors.greyBg },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between' },
  raised: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.black },
  goal: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 140,
    backgroundColor: colors.purpleTint,
    alignItems: 'center',
  },
  buttonText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.purple },
});
