import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { PetRow, Tag } from '@/components/PetRow';
import { Chip, Icon, NavHeader } from '@/components/ui';
import { categories } from '@/data/pets';
import { PetProfile, profiles } from '@/data/profiles';
import { colors, fonts } from '@/theme';

const kinds = [
  { label: 'All', kind: null },
  { label: 'Dogs', kind: 'dog' },
  { label: 'Cats', kind: 'cat' },
  { label: 'Other', kind: 'other' },
] as const;
type Kind = PetProfile['kind'];

// Every adoptable pet with search, type and category filters.
export default function Browse() {
  const params = useLocalSearchParams<{ q?: string; category?: string; kind?: Kind }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [kind, setKind] = useState<Kind | null>(params.kind ?? null);
  const [category, setCategory] = useState<string | null>(params.category ?? null);

  const q = query.trim().toLowerCase();
  const results = profiles.filter(
    (p) =>
      (!kind || p.kind === kind) &&
      (!category || p.categories.includes(category)) &&
      (!q || [p.name, p.breed, p.shelter, p.note].some((field) => field.toLowerCase().includes(q))),
  );

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step={category ?? 'All pets'} />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.search}>
          <Icon source={require('../../assets/figma/icon-search.svg')} />
          <TextInput
            placeholder="Name, breed or shelter"
            placeholderTextColor="rgba(0,0,0,0.3)"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoFocus={!params.q && !params.category}
            clearButtonMode="while-editing"
          />
        </View>

        <View style={styles.chips}>
          {kinds.map((k) => (
            <Chip key={k.label} label={k.label} selected={kind === k.kind} onPress={() => {
                setKind(k.kind);
                // Drop a category that doesn't exist for the new animal type.
                if (k.kind && category && !categories.find((c) => c.label === category)?.kinds.includes(k.kind)) setCategory(null);
              }} />
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {categories.filter((c) => !kind || c.kinds.includes(kind)).map((c) => (
            <Chip
              key={c.label}
              label={c.label}
              variant="outline"
              selected={category === c.label}
              onPress={() => setCategory(category === c.label ? null : c.label)}
            />
          ))}
        </ScrollView>

        <Text style={styles.count}>
          {results.length} {results.length === 1 ? 'pet' : 'pets'} found
        </Text>

        <View style={{ gap: 12 }}>
          {results.map((pet, i) => (
            <FadeInUp key={pet.id} delay={i * 50}>
              <PetRow pet={pet} photo={pet.thumb} note={pet.note} onPress={() => router.push(`/pet/${pet.id}`)}>
                <Tag label={`${pet.match}% match`} />
                {pet.urgent && <Tag label="Urgent" tone="purple" />}
              </PetRow>
            </FadeInUp>
          ))}
          {!results.length && (
            <Text style={styles.empty}>
              No pets match yet. Try another search or clear the filters — new animals arrive every week.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 16 },
  search: {
    height: 56,
    borderRadius: 30,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 16, color: colors.black },
  chips: { flexDirection: 'row', gap: 8 },
  count: { fontFamily: fonts.medium, fontSize: 13, color: colors.purple },
  empty: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.grey, textAlign: 'center', marginTop: 24 },
});
