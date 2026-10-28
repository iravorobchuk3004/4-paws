import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PetCard } from '@/components/PetCard';
import { Chip, Icon, SectionHeader } from '@/components/ui';
import { categories, mostLoved, Pet, perfectMatches, stories } from '@/data/pets';
import { profiles } from '@/data/profiles';
import { colors, fonts } from '@/theme';

const filters = ['All', 'Dogs', 'Cats', 'Other'];

const openPet = (pet: Pet) => {
  if (profiles.some((p) => p.id === pet.id)) router.push(`/pet/${pet.id}`);
};

export default function Home() {
  const [filter, setFilter] = useState('All');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 220 }} showsVerticalScrollIndicator={false}>
        <View style={styles.location}>
          <Icon source={require('../../../assets/figma/location-pin.svg')} />
          <Text style={styles.city}>
            Hamburg<Text style={styles.radius}> · 25 km</Text>
          </Text>
          <Icon source={require('../../../assets/figma/icon-chevron-down.svg')} size={16} />
        </View>

        <View style={styles.search}>
          <Icon source={require('../../../assets/figma/icon-search.svg')} />
          <TextInput
            placeholder="Find your new friend"
            placeholderTextColor="rgba(0,0,0,0.3)"
            style={styles.searchInput}
          />
          <Pressable style={styles.filterButton}>
            <Icon source={require('../../../assets/figma/icon-filters.svg')} size={20} />
          </Pressable>
        </View>

        <View style={styles.filters}>
          {filters.map((f) => (
            <Chip
              key={f}
              label={f}
              variant="outline"
              selected={filter === f}
              icon={f === 'All' ? require('../../../assets/figma/icon-all.svg') : undefined}
              onPress={() => setFilter(f)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Popular now" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {categories.map((c) => (
              <Pressable key={c.label} style={styles.tile}>
                <Image source={c.photo} style={styles.tilePhoto} contentFit="cover" />
                <Text style={styles.tileLabel} numberOfLines={1}>
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Perfect match for you" onSeeAll={() => router.push('/matches')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {perfectMatches.map((pet) => (
              <PetCard key={pet.id} pet={pet} onPress={() => openPet(pet)} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Most loved this week" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {mostLoved.map((pet) => (
              <PetCard key={pet.id} pet={pet} onPress={() => openPet(pet)} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Happy tails" />
          <View style={styles.statRow}>
            <Icon source={require('../../../assets/figma/home-heart-small.svg')} size={18} />
            <Text style={styles.stat}>
              <Text style={styles.statStrong}>1,248</Text> pets found a home in Hamburg this year
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {stories.map((s) => (
              <View key={s.id} style={styles.story}>
                <View style={styles.storyPhotos}>
                  <View style={[styles.storyPhoto, styles.storyBefore]}>
                    <Image source={s.before} style={StyleSheet.absoluteFill} contentFit="cover" />
                    <View style={[styles.storyLabel, { backgroundColor: 'rgba(27,27,27,0.7)' }]}>
                      <Text style={styles.storyLabelText}>Before · shelter</Text>
                    </View>
                  </View>
                  <View style={[styles.storyPhoto, styles.storyNow]}>
                    <Image source={s.now} style={StyleSheet.absoluteFill} contentFit="cover" />
                    <View style={[styles.storyLabel, { backgroundColor: colors.purple }]}>
                      <Text style={styles.storyLabelText}>Now · home</Text>
                    </View>
                  </View>
                  <View style={styles.storySwap}>
                    <Icon source={require('../../../assets/figma/story-swap.svg')} size={18} />
                  </View>
                </View>
                <Text style={styles.quote}>{s.quote}</Text>
                <View style={styles.storyFooter}>
                  <Image source={s.avatar} style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.storyNames}>{s.names}</Text>
                    <Text style={styles.storyMeta}>{s.meta}</Text>
                  </View>
                  <Icon source={require('../../../assets/figma/icon-arrow.svg')} size={20} />
                </View>
              </View>
            ))}
          </ScrollView>
          <Pressable style={styles.share}>
            <Icon source={require('../../../assets/figma/icon-plus.svg')} size={16} />
            <Text style={styles.shareText}>Share your story</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, marginTop: 8 },
  city: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  radius: { fontFamily: fonts.regular, color: colors.greyMuted },
  search: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 16, color: colors.black },
  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#D9D5CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 12 },
  section: { marginTop: 24, gap: 10 },
  row: { paddingHorizontal: 16, gap: 12 },
  tile: { width: 80, gap: 8, alignItems: 'center' },
  tilePhoto: { width: 80, height: 80, borderRadius: 12, backgroundColor: colors.greyBg },
  tileLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.black,
  },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, marginTop: -2 },
  stat: { fontFamily: fonts.regular, fontSize: 12, color: colors.greyMuted },
  statStrong: { fontFamily: fonts.semiBold, color: colors.black },
  story: {
    width: 300,
    height: 241,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 10,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  storyPhotos: { flexDirection: 'row', gap: 6, height: 130 },
  storyPhoto: { flex: 1, overflow: 'hidden', padding: 8 },
  storyBefore: {
    opacity: 0.8,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  storyNow: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  storyLabel: { alignSelf: 'flex-start', borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3 },
  storyLabelText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    letterSpacing: 0.54,
    textTransform: 'uppercase',
    color: colors.white,
  },
  storySwap: {
    position: 'absolute',
    left: 124,
    top: 44,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#F1EEE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quote: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 17,
    color: colors.black,
    marginTop: 14,
    paddingHorizontal: 4,
  },
  storyFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 'auto', paddingHorizontal: 4 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  storyNames: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.black },
  storyMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.greyMuted },
  share: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16 },
  shareText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.purple },
});
