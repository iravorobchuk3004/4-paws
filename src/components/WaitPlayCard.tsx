import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/anim';
import { getProfile } from '@/data/profiles';
import { mealsFrom } from '@/lib/treats';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

// Offers Treat Run at the moments people are waiting on someone else (a shelter, a volunteer).
export function WaitPlayCard({ petId, wait }: { petId: string; wait: string }) {
  const { treats } = useApp();
  const pet = getProfile(petId);
  return (
    <PressableScale style={styles.card} onPress={() => router.push(`/play/${pet.id}`)} scaleTo={0.97}>
      <Image source={pet.thumb} style={styles.pet} contentFit="cover" />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.label}>{wait}</Text>
        <Text style={styles.title}>Play Treat Run with {pet.name}</Text>
        <Text style={styles.text}>
          🦴 {treats} bones · 🍲 {mealsFrom(treats)} real meals for shelter pets
        </Text>
      </View>
      <Ionicons name="play-circle" size={36} color={colors.white} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingRight: 16,
    borderRadius: 20,
    backgroundColor: colors.purple,
  },
  pet: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: colors.white },
  label: { fontFamily: fonts.medium, fontSize: 11, color: colors.lime },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  text: { fontFamily: fonts.regular, fontSize: 12, color: colors.purpleSelected },
});
