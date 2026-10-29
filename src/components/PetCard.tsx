import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LikePop, PressableScale } from '@/components/anim';
import { Icon } from '@/components/ui';
import { Pet } from '@/data/pets';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const sexIcons = {
  female: require('../../assets/figma/sex-female.svg'),
  male: require('../../assets/figma/sex-male.svg'),
};

export function PetCard({ pet, onPress }: { pet: Pet; onPress?: () => void }) {
  const { saved, toggleSaved } = useApp();
  const liked = saved.includes(pet.id);

  return (
    <PressableScale style={styles.card} onPress={onPress} scaleTo={0.97}>
      <View style={styles.photo}>
        <Image source={pet.photo} style={StyleSheet.absoluteFill} contentFit="cover" />
        <View style={styles.tag}>
          <Text style={styles.tagText} numberOfLines={1}>
            {pet.tag}
          </Text>
        </View>
        <Pressable
          style={styles.like}
          onPress={() => toggleSaved(pet.id)}
          hitSlop={8}
        >
          <LikePop active={liked}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={16} color={colors.black} />
          </LikePop>
        </Pressable>
      </View>
      <View style={{ gap: 4 }}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {pet.name}
          </Text>
          <Icon source={sexIcons[pet.sex]} size={18} />
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {pet.breed} · {pet.age} · {pet.distance}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 164,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 8,
    gap: 8,
  },
  photo: { height: 140, backgroundColor: colors.greyBg },
  like: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 8 },
  name: { flexShrink: 1, fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 22, color: colors.black },
  tag: {
    position: 'absolute',
    left: 8,
    top: 8,
    height: 22,
    justifyContent: 'center',
    borderRadius: 11,
    paddingHorizontal: 8,
    backgroundColor: colors.pinkLight,
  },
  tagText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    letterSpacing: 0.36,
    color: colors.black,
    textTransform: 'uppercase',
  },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.black, paddingHorizontal: 8 },
});
