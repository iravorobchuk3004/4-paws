import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Tag } from '@/components/PetRow';
import { ShelterMap } from '@/components/ShelterMap';
import { Timeline } from '@/components/Timeline';
import { NavHeader, PrimaryButton, SecondaryButton } from '@/components/ui';
import { getProfile } from '@/data/profiles';
import { formatDate, useApp } from '@/store';
import { colors, fonts } from '@/theme';

// Sample shelter contacts until shelters are connected to a backend.
const contacts: Record<string, { phone: string; email: string }> = {
  'Paw Haven': { phone: '+4940123456', email: 'hello@pawhaven.example' },
  'Safe Tails': { phone: '+4940654321', email: 'team@safetails.example' },
  'Happy Tails': { phone: '+4940777888', email: 'adopt@happytails.example' },
};

// Status of a meeting request, with ways to reach the shelter or withdraw it.
export default function ApplicationStatus() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = getProfile(id);
  const { applications, appliedAt, cancelApplication } = useApp();
  const active = applications.includes(pet.id);
  const contact = contacts[pet.shelter];
  const sentAt = appliedAt[pet.id];

  const withdraw = () =>
    Alert.alert(`Withdraw your request for ${pet.name}?`, 'The shelter will be told you are no longer interested.', [
      { text: 'Keep request', style: 'cancel' },
      {
        text: 'Withdraw',
        style: 'destructive',
        onPress: () => {
          cancelApplication(pet.id);
          router.back();
        },
      },
    ]);

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Application" />
      <ScrollView contentContainerStyle={styles.body}>
        <Pressable style={styles.card} onPress={() => router.push(`/pet/${pet.id}`)}>
          <Image source={pet.thumb} style={styles.photo} contentFit="cover" />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.name}>Meeting {pet.name}</Text>
            <Text style={styles.meta}>{pet.shelter}</Text>
          </View>
          <Tag label={active ? 'In review' : 'Withdrawn'} tone={active ? 'purple' : 'grey'} />
        </Pressable>

        <View style={[styles.card, styles.column]}>
          {active ? (
            <Timeline
              steps={[
                { title: 'Sent', text: sentAt ? formatDate(sentAt) : '', state: 'done' },
                { title: 'Shelter review', text: 'Reply in ~2 days', state: 'current' },
                { title: 'Meet ' + pet.name, text: '', state: 'next' },
                { title: 'Welcome home', text: '', state: 'next' },
              ]}
            />
          ) : (
            <Text style={styles.meta}>Request withdrawn.</Text>
          )}
        </View>

        {active && <ShelterMap shelter={pet.shelter} />}

        {active && contact && (
          <View style={{ gap: 12 }}>
            <View style={styles.contactRow}>
              <Pressable style={styles.contact} onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
                <Ionicons name="call-outline" size={20} color={colors.purple} />
                <Text style={styles.contactText}>Call</Text>
              </Pressable>
              <Pressable
                style={styles.contact}
                onPress={() =>
                  Linking.openURL(`mailto:${contact.email}?subject=${encodeURIComponent(`Meeting ${pet.name}`)}`)
                }
              >
                <Ionicons name="mail-outline" size={20} color={colors.purple} />
                <Text style={styles.contactText}>Email</Text>
              </Pressable>
            </View>
          </View>
        )}

        {active && (
          <Pressable style={styles.play} onPress={() => router.push(`/play/${pet.id}`)}>
            <Text style={styles.playEmoji}>🦴</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.playTitle}>While you wait: Treat Run</Text>
              <Text style={styles.playText}>Play with {pet.name} · bones feed shelter pets</Text>
            </View>
            <Ionicons name="play-circle" size={32} color={colors.white} />
          </Pressable>
        )}
      </ScrollView>

      <View style={styles.bottom}>
        {active ? (
          <SecondaryButton title="Withdraw request" onPress={withdraw} />
        ) : (
          <PrimaryButton title={`Request to meet ${pet.name} again`} onPress={() => router.replace(`/meeting/${pet.id}`)} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 20 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, backgroundColor: colors.white },
  column: { flexDirection: 'column', alignItems: 'stretch' },
  photo: { width: 64, height: 64, borderRadius: 12 },
  name: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  meta: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.grey },
  contactRow: { flexDirection: 'row', gap: 12 },
  contact: {
    flex: 1,
    height: 52,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.purple,
  },
  contactText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.purple },
  play: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, backgroundColor: colors.purple },
  playEmoji: { fontSize: 28 },
  playTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  playText: { fontFamily: fonts.regular, fontSize: 12, color: colors.purpleSelected },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
