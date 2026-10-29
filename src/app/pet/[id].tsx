import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Tag } from '@/components/PetRow';
import { LikePop } from '@/components/anim';
import { Icon, NavHeader, PrimaryButton } from '@/components/ui';
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

export default function PetDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = getProfile(id);
  const { saved, toggleSaved, applications } = useApp();
  const isSaved = saved.includes(pet.id);
  const applied = applications.includes(pet.id);

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step={pet.shelter} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={pet.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
          <Pressable style={styles.heroButton} onPress={() => toggleSaved(pet.id)}>
            <LikePop active={isSaved}>
              <Icon
                source={
                  isSaved
                    ? require('../../../assets/figma/heart-filled.svg')
                    : require('../../../assets/figma/hero-heart.svg')
                }
                size={20}
              />
            </LikePop>
          </Pressable>
          <Pressable
            style={styles.heroButton}
            onPress={() => Share.share({ message: `Meet ${pet.name} on 4 Paws!` })}
          >
            <Icon source={require('../../../assets/figma/hero-share.svg')} size={20} />
          </Pressable>
        </View>

        <View style={{ gap: 4 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{pet.name}</Text>
            <Icon
              source={
                pet.sex === 'female'
                  ? require('../../../assets/figma/name-female.svg')
                  : require('../../../assets/figma/gender-male.svg')
              }
              size={20}
            />
            <View style={{ flex: 1 }} />
            <Tag label={`${pet.match}% match`} />
          </View>
          <Text style={styles.meta}>
            {pet.breed} · {pet.age} · {pet.size.toLowerCase()} · {pet.distance} away
          </Text>
        </View>

        <View style={styles.facts}>
          <Fact label="Age" value={pet.age} />
          <Fact label="Size" value={pet.size} />
          <Fact label="Weight" value={pet.weight} />
        </View>

        <Section title="Health">
          <View style={styles.chips}>
            {pet.health.map((h) => (
              <View key={h} style={styles.healthChip}>
                <Icon source={require('../../../assets/figma/check-purple.svg')} size={16} />
                <Text style={styles.healthText}>{h}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Behaviour & home fit">
          <View style={[card, styles.fitList]}>
            {pet.fit.map((row) => (
              <View key={row.text} style={styles.fitRow}>
                <Icon source={row.icon} size={20} />
                <Text style={[styles.fitText, row.muted && { color: colors.grey }]}>{row.text}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="About">
          <Text style={styles.about}>{pet.about}</Text>
        </Section>

        <Pressable
          style={[card, styles.shelter]}
          onPress={() =>
            Linking.openURL(
              `https://maps.google.com/?q=${encodeURIComponent(`${pet.shelter} animal shelter ${pet.shelterMeta.split(' · ')[0]}`)}`,
            )
          }
        >
          <View style={styles.shelterIcon}>
            <Icon source={require('../../../assets/figma/shelter-home.svg')} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.shelterName}>{pet.shelter} shelter</Text>
            <Text style={styles.shelterMeta}>{pet.shelterMeta}</Text>
          </View>
          <Icon source={require('../../../assets/figma/chevron-right.svg')} size={20} />
        </Pressable>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title={applied ? 'View application status' : 'Apply for a meeting'}
          onPress={() => router.push(applied ? `/applications/${pet.id}` : `/meeting/${pet.id}`)}
        />
      </View>
    </SafeAreaView>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={[card, styles.fact]}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, gap: 24 },
  hero: {
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.greyBg,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 12,
    gap: 8,
  },
  heroButton: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: colors.white,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.black },
  meta: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey },
  facts: { flexDirection: 'row', gap: 8 },
  fact: { flex: 1, padding: 12, gap: 2 },
  factLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  factValue: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  healthChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 140,
    backgroundColor: colors.purpleTint,
  },
  healthText: { fontFamily: fonts.medium, fontSize: 14, color: colors.purple },
  fitList: { padding: 16, gap: 12 },
  fitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fitText: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.black },
  about: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, color: colors.black },
  shelter: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 12, paddingRight: 16, paddingVertical: 12 },
  shelterIcon: { padding: 12, borderRadius: 100, backgroundColor: colors.purpleTint },
  shelterName: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  shelterMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
