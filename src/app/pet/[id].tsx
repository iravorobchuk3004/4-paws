import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ComponentProps, useState } from 'react';
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
  const [aboutOpen, setAboutOpen] = useState(false);

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
        <Text style={styles.meta}>{pet.breed}</Text>

        <View style={styles.facts}>
          <Fact icon="calendar-outline" value={pet.age} label="Age" />
          <Fact icon="resize-outline" value={pet.size} label="Size" />
          <Fact icon="barbell-outline" value={pet.weight} label="Weight" />
          <Fact icon="location-outline" value={pet.distance} label="Away" />
        </View>

        <Section title="Health">
          <View style={styles.chips}>
            {pet.health.map((h) => (
              <View key={h} style={styles.healthChip}>
                <Ionicons name="checkmark-circle" size={16} color={colors.purple} />
                <Text style={styles.healthText}>{h}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Personality">
          <View style={styles.chips}>
            {pet.fit.map((row) => (
              <View key={row.text} style={[styles.fitChip, row.muted && styles.fitChipMuted]}>
                <Icon source={row.icon} size={16} />
                <Text style={[styles.fitText, row.muted && { color: colors.grey }]}>{row.text}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="About">
          <Pressable onPress={() => setAboutOpen((o) => !o)}>
            <Text style={styles.about} numberOfLines={aboutOpen ? undefined : 2}>
              {pet.about}
            </Text>
            <Text style={styles.more}>{aboutOpen ? 'Show less' : 'Read more'}</Text>
          </Pressable>
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
          <View style={{ flex: 1 }}>
            <Text style={styles.shelterName}>{pet.shelter}</Text>
            <Text style={styles.shelterMeta}>{pet.shelterMeta.split(' · ')[0]}</Text>
          </View>
          <Icon source={require('../../../assets/figma/chevron-right.svg')} size={20} />
        </Pressable>
      </ScrollView>

      <View style={styles.bottom}>
        <Pressable style={styles.playButton} onPress={() => router.push(`/play/${pet.id}`)} accessibilityLabel={`Play Treat Run with ${pet.name}`}>
          <Ionicons name="game-controller" size={24} color={colors.purple} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            title={applied ? 'Application status' : 'Apply for a meeting'}
            onPress={() => router.push(applied ? `/applications/${pet.id}` : `/meeting/${pet.id}`)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Fact({ icon, value, label }: { icon: ComponentProps<typeof Ionicons>['name']; value: string; label: string }) {
  return (
    <View style={[card, styles.fact]}>
      <Ionicons name={icon} size={18} color={colors.purple} />
      <Text style={styles.factValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.factLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 18 },
  hero: {
    height: 320,
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
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: -14 },
  name: { fontFamily: fonts.extraBold, fontSize: 26, color: colors.black },
  meta: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey },
  facts: { flexDirection: 'row', gap: 8 },
  fact: { flex: 1, paddingVertical: 10, paddingHorizontal: 4, alignItems: 'center', gap: 2 },
  factLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.grey },
  factValue: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.grey,
  },
  fitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 140,
    backgroundColor: colors.white,
  },
  fitChipMuted: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.greyBg },
  more: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.purple, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  healthChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 140,
    backgroundColor: colors.purpleTint,
  },
  healthText: { fontFamily: fonts.medium, fontSize: 13, color: colors.purple },
  fitText: { fontFamily: fonts.medium, fontSize: 13, color: colors.black },
  about: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, color: colors.black },
  shelter: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 12, paddingRight: 16, paddingVertical: 12 },
  shelterIcon: { padding: 12, borderRadius: 100, backgroundColor: colors.purpleTint },
  shelterName: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  shelterMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  bottom: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.purpleTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
