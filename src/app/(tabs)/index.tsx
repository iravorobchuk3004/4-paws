import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { PetCard } from '@/components/PetCard';
import { KindSwitch } from '@/components/KindSwitch';
import { Icon, SectionHeader } from '@/components/ui';
import { categories, mostLoved, Pet, perfectMatches, stories } from '@/data/pets';
import { profiles } from '@/data/profiles';
import { useInbox } from '@/lib/inbox';
import { colors, fonts } from '@/theme';

const filters = [
  { value: 'All', label: 'All', icon: 'paw' },
  { value: 'Dogs', label: 'Dogs', icon: 'dog' },
  { value: 'Cats', label: 'Cats', icon: 'cat' },
  { value: 'Other', label: 'Other', icon: 'rabbit' },
] as const;
const kindFor: Record<string, string | undefined> = { Dogs: 'dog', Cats: 'cat', Other: 'other' };
const radii = ['10 km', '25 km', '50 km'];

const openPet = (pet: Pet) => router.push(`/pet/${pet.id}`);
const matchesFilter = (pet: Pet, filter: string) =>
  filter === 'All' || profiles.find((p) => p.id === pet.id)?.kind === kindFor[filter];

export default function Home() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState('25 km');
  const { unread } = useInbox();

  const matches = perfectMatches.filter((p) => matchesFilter(p, filter));
  const loved = mostLoved.filter((p) => matchesFilter(p, filter));

  const search = () => {
    router.push({ pathname: '/browse', params: { q: query.trim() } });
    setQuery('');
  };
  const pickRadius = () =>
    Alert.alert('Search radius', 'Show pets within', [
      ...radii.map((r) => ({ text: r, onPress: () => setRadius(r) })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 220 }} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={0} style={styles.topRow}>
          <Pressable style={styles.location} onPress={pickRadius} hitSlop={8}>
            <Icon source={require('../../../assets/figma/location-pin.svg')} />
            <Text style={styles.city}>
              Hamburg<Text style={styles.radius}> · {radius}</Text>
            </Text>
            <Icon source={require('../../../assets/figma/icon-chevron-down.svg')} size={16} />
          </Pressable>
          <Pressable style={styles.bell} onPress={() => router.push('/inbox')} hitSlop={8}>
            <Ionicons name="notifications-outline" size={22} color={colors.black} />
            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
              </View>
            )}
          </Pressable>
        </FadeInUp>

        <FadeInUp delay={70} style={styles.search}>
          <Icon source={require('../../../assets/figma/icon-search.svg')} />
          <TextInput
            placeholder="Find your new friend"
            placeholderTextColor="rgba(0,0,0,0.3)"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={search}
          />
          <Pressable style={styles.filterButton} onPress={() => router.push('/browse')}>
            <Icon source={require('../../../assets/figma/icon-filters.svg')} size={20} />
          </Pressable>
        </FadeInUp>

        <FadeInUp delay={140} style={styles.filters}>
          <KindSwitch options={[...filters]} value={filter} onChange={setFilter} />
        </FadeInUp>

        <FadeInUp delay={210} style={styles.section}>
          <SectionHeader title="Popular now" onSeeAll={() => router.push('/browse')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {categories.map((c) => (
              <Pressable
                key={c.label}
                style={styles.tile}
                onPress={() => router.push({ pathname: '/browse', params: { category: c.label } })}
              >
                <Image source={c.photo} style={styles.tilePhoto} contentFit="cover" />
                <Text style={styles.tileLabel} numberOfLines={1}>
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </FadeInUp>

        <FadeInUp delay={280} style={styles.section}>
          <SectionHeader title="Perfect match for you" onSeeAll={() => router.push('/matches')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {matches.map((pet) => (
              <PetCard key={pet.id} pet={pet} onPress={() => openPet(pet)} />
            ))}
            {!matches.length && <Text style={styles.empty}>No {filter.toLowerCase()} in this list right now.</Text>}
          </ScrollView>
        </FadeInUp>

        <FadeInUp delay={350} style={styles.section}>
          <SectionHeader title="Most loved this week" onSeeAll={() => router.push('/browse')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {loved.map((pet) => (
              <PetCard key={pet.id} pet={pet} onPress={() => openPet(pet)} />
            ))}
            {!loved.length && <Text style={styles.empty}>No {filter.toLowerCase()} in this list right now.</Text>}
          </ScrollView>
        </FadeInUp>

        <FadeInUp delay={420} style={styles.section}>
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
                    {/* Same pet as "now", dimmed behind kennel bars, so the pair reads as one story. */}
                    <Image source={s.now} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={1} />
                    <View style={[StyleSheet.absoluteFill, styles.storyDim]} />
                    <View style={[StyleSheet.absoluteFill, styles.bars]}>
                      {Array.from({ length: 6 }, (_, i) => (
                        <View key={i} style={styles.bar} />
                      ))}
                    </View>
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
          <Pressable
            style={styles.share}
            onPress={() =>
              Alert.alert('Share your story', 'Adopted through 4 Paws? Story sharing is coming soon — we can’t wait to see your photos!')
            }
          >
            <Icon source={require('../../../assets/figma/icon-plus.svg')} size={16} />
            <Text style={styles.shareText}>Share your story</Text>
          </Pressable>
        </FadeInUp>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cream,
  },
  badgeText: { fontFamily: fonts.bold, fontSize: 9, color: colors.white },
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
  filters: { paddingHorizontal: 16, marginTop: 16 },
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
  storyFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingHorizontal: 4 },
  storyDim: { backgroundColor: 'rgba(60,60,70,0.45)' },
  bars: { flexDirection: 'row', justifyContent: 'space-evenly' },
  bar: { width: 3, height: '100%', backgroundColor: 'rgba(220,220,220,0.75)' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  storyNames: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.black },
  storyMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.greyMuted },
  share: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey, paddingVertical: 24 },
  shareText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.purple },
});
