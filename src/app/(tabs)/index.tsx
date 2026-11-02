import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { PetCard } from '@/components/PetCard';
import { StoryCard } from '@/components/StoryCard';
import { CategoryTile } from '@/components/CategoryTile';
import { WigglingMascot } from '@/components/Celebration';
import { Icon, SectionHeader } from '@/components/ui';
import { allCategory, categories, Category, Pet, stories, toCard } from '@/data/pets';
import { profiles } from '@/data/profiles';
import { useInbox } from '@/lib/inbox';
import { matchScore } from '@/lib/match';
import { myStoryCard, shareStory } from '@/lib/stories';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const MATCH_COUNT = 5;
const radii = ['10 km', '25 km', '50 km'];

const openPet = (pet: Pet) => router.push(`/pet/${pet.id}`);

// Cards for the selected category: best matches for your lifestyle first, then the most saved of the rest.
function homeLists(category: Category, prefs: Record<string, string[]>) {
  const pool = profiles
    .filter((p) => category === allCategory || p.categories.includes(category.label))
    .map((p) => ({ p, score: matchScore(p, prefs) }));
  const top = [...pool].sort((a, b) => b.score - a.score).slice(0, Math.min(MATCH_COUNT, Math.ceil(pool.length / 2)));
  const rest = pool.filter((x) => !top.includes(x)).sort((a, b) => b.p.loved - a.p.loved).slice(0, 6);
  return {
    matches: top.map(({ p, score }) => toCard(p, `${score}% match`)),
    loved: rest.map(({ p }) => toCard(p, p.urgent ? 'Urgent' : p.addedDaysAgo <= 3 ? 'New' : `${p.loved} saves`)),
  };
}

export default function Home() {
  const [category, setCategory] = useState<Category>(allCategory);
  const label = category === allCategory ? 'pets' : category.label.toLowerCase();
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState('25 km');
  const { unread } = useInbox();
  const { preferences, stories: myStories, user } = useApp();
  // Until the quiz is answered, matches are only a rough guess, so we invite people to take it.
  const answered = Object.keys(preferences).length > 0;

  const { matches, loved } = homeLists(category, preferences);
  const browseParams = category === allCategory ? {} : { category: category.label };
  const pick = (c: Category) => setCategory(c === category ? allCategory : c);

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
          <Pressable style={styles.filterButton} onPress={() => router.push('/filters')} accessibilityLabel="Filters">
            <Icon source={require('../../../assets/figma/icon-filters.svg')} size={20} />
          </Pressable>
        </FadeInUp>

        <FadeInUp delay={140} style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {[allCategory, ...categories].map((c) => (
              <CategoryTile key={c.label} category={c} selected={category === c} onPress={() => pick(c)} />
            ))}
          </ScrollView>
        </FadeInUp>

        {!answered && (
          <FadeInUp delay={250} style={styles.section}>
            <Pressable
              style={styles.quiz}
              onPress={() => router.push({ pathname: '/onboarding/quiz', params: { edit: 'filters' } })}
            >
              <WigglingMascot animal="dog" width={56} height={56} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.quizTitle}>Who fits your life?</Text>
                <Text style={styles.quizText}>6 quick questions, then we sort pets by how well they match you.</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.white} />
            </Pressable>
          </FadeInUp>
        )}

        <FadeInUp delay={280} style={styles.section}>
          <SectionHeader title="Perfect match for you" onSeeAll={() => router.push('/matches')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {matches.map((pet) => (
              <PetCard key={pet.id} pet={pet} onPress={() => openPet(pet)} />
            ))}
            {!matches.length && <Text style={styles.empty}>No {label} in this list right now.</Text>}
          </ScrollView>
        </FadeInUp>

        <FadeInUp delay={350} style={styles.section}>
          <SectionHeader title="Most loved this week" onSeeAll={() => router.push({ pathname: '/browse', params: browseParams })} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {loved.map((pet) => (
              <PetCard key={pet.id} pet={pet} onPress={() => openPet(pet)} />
            ))}
            {!loved.length && <Text style={styles.empty}>No {label} in this list right now.</Text>}
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
            {myStories.map((st) => (
              <StoryCard key={st.id} story={myStoryCard(st, user)} onShare={() => shareStory(st)} />
            ))}
            {stories.map((s) => (
              <StoryCard
                key={s.id}
                story={{ photo: s.now, quote: s.quote, names: s.names, meta: s.meta, avatar: s.avatar }}
              />
            ))}
          </ScrollView>
          <Pressable
            style={styles.share}
            onPress={() => router.push('/story/new')}
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
  quiz: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingRight: 16,
    borderRadius: 20,
    backgroundColor: colors.purple,
  },
  quizTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  quizText: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.purpleSelected },
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
    borderWidth: 1,
    borderColor: colors.greyOption,
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
  section: { marginTop: 24, gap: 10 },
  row: { paddingHorizontal: 16, gap: 12 },
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
  share: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey, paddingVertical: 24 },
  shareText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.purple },
});
