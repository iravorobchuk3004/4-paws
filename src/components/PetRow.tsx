import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LikePop, PressableScale } from '@/components/anim';
import { Icon } from '@/components/ui';
import { PetProfile } from '@/data/profiles';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const genderIcons = {
  female: require('../../assets/figma/gender-female.svg'),
  male: require('../../assets/figma/gender-male.svg'),
};

// Horizontal pet card used on "Your matches" and "Saved animals".
export function PetRow({
  pet,
  photo,
  note,
  children,
  onPress,
}: {
  pet: PetProfile;
  photo: number;
  note?: string;
  children?: ReactNode;
  onPress?: () => void;
}) {
  const { saved, toggleSaved } = useApp();
  const isSaved = saved.includes(pet.id);

  return (
    <PressableScale style={styles.card} onPress={onPress} scaleTo={0.97}>
      <Image source={photo} style={styles.photo} contentFit="cover" />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pet.name}</Text>
          <Icon source={genderIcons[pet.sex]} size={16} />
          <View style={{ flex: 1 }} />
          <Pressable onPress={() => toggleSaved(pet.id)} hitSlop={10}>
            <LikePop active={isSaved}>
              <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={20} color={colors.black} />
            </LikePop>
          </Pressable>
        </View>
        <Text style={styles.meta}>
          {pet.breed} · {pet.age} · {pet.distance}
        </Text>
        {note && <Text style={styles.note}>{note}</Text>}
        <View style={styles.tags}>{children}</View>
      </View>
    </PressableScale>
  );
}

export function Tag({ label, tone = 'pink' }: { label: string; tone?: 'pink' | 'purple' | 'grey' }) {
  const bg = { pink: colors.pinkLight, purple: colors.purpleTint, grey: colors.greyOption }[tone];
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      <Text style={[styles.tagText, tone === 'purple' && { color: colors.purple }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  photo: { width: 96, height: 96, borderRadius: 8, backgroundColor: colors.greyBg },
  info: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.black },
  note: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tag: { height: 20, justifyContent: 'center', borderRadius: 4, paddingHorizontal: 6 },
  tagText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    letterSpacing: 0.36,
    textTransform: 'uppercase',
    color: colors.black,
  },
});
