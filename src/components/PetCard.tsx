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
  const small = pet.tag.toLowerCase().includes('match');

  return (
    <PressableScale style={styles.card} onPress={onPress} scaleTo={0.97}>
      <View style={styles.photo}>
        <Image source={pet.photo} style={StyleSheet.absoluteFill} contentFit="cover" />
        <Pressable
          style={[styles.like, { backgroundColor: pet.tagColor ?? colors.pinkTag }]}
          onPress={() => toggleSaved(pet.id)}
          hitSlop={8}
        >
          <LikePop active={liked}>
            <Icon
              source={require('../../assets/figma/card-heart.svg')}
              size={16}
              tint={liked ? colors.purple : undefined}
            />
          </LikePop>
        </Pressable>
      </View>
      <View style={{ gap: 4 }}>
        <View style={styles.row}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{pet.name}</Text>
            <Icon source={sexIcons[pet.sex]} size={18} />
          </View>
          <View style={[styles.tag, { backgroundColor: pet.tagColor ?? colors.pinkTag }]}>
            <Text style={[styles.tagText, small && styles.tagTextSmall]}>{pet.tag}</Text>
          </View>
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
    borderRadius: 8,
    overflow: 'hidden',
    paddingBottom: 8,
    gap: 8,
  },
  photo: { height: 140, backgroundColor: colors.greyBg },
  like: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 34,
    height: 26,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  name: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 22, color: colors.black },
  tag: { borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2 },
  tagText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    letterSpacing: 0.4,
    color: colors.black,
    textTransform: 'uppercase',
  },
  tagTextSmall: { fontSize: 8, letterSpacing: 0.32 },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.black, paddingHorizontal: 8 },
});
