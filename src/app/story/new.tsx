import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Celebration } from '@/components/Celebration';
import { ChoiceField, TextArea } from '@/components/form';
import { StoryCard } from '@/components/StoryCard';
import { FormField, NavHeader, PageHeading, PrimaryButton, SecondaryButton } from '@/components/ui';
import { myStoryCard, shareStory } from '@/lib/stories';
import { Story, useApp } from '@/store';
import { colors, fonts } from '@/theme';

const MAX = 200;
const shelters = ['Paw Haven', 'Safe Tails', 'Happy Tails', 'Other'];
const whens = ['This month', '1–6 months ago', '6–12 months ago', 'Over a year ago'];

// "Share your story": photo of the pet at home, a few words, then a shareable Happy tails card.
export default function NewStory() {
  const { user, addStory } = useApp();
  const [photo, setPhoto] = useState<string>();
  const [petName, setPetName] = useState('');
  const [shelter, setShelter] = useState('Paw Haven');
  const [when, setWhen] = useState('1–6 months ago');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [posted, setPosted] = useState<Story | null>(null);

  const photoError = submitted && !photo;
  const nameError = submitted && !petName.trim() && 'What’s your pet’s name?';
  const textError = submitted && text.trim().length < 10;

  const pick = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow access in Settings to add a photo.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]);
      return;
    }
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.8, allowsEditing: true, aspect: [3, 2] };
    const result =
      source === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const choosePhoto = () =>
    Alert.alert(photo ? 'Change photo' : 'Add a photo', undefined, [
      { text: 'Take photo', onPress: () => pick('camera') },
      { text: 'Choose from library', onPress: () => pick('library') },
      ...(photo ? [{ text: 'Delete photo', style: 'destructive' as const, onPress: () => setPhoto(undefined) }] : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);

  const post = () => {
    setSubmitted(true);
    if (!photo || !petName.trim() || text.trim().length < 10) return;
    setPosted(addStory({ photo, petName: petName.trim(), shelter, when, text: text.trim() }));
  };

  if (posted) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.done}>
          <Celebration />
          <Text style={styles.doneTitle}>Your story is live!</Text>
          <Text style={styles.doneText}>It’s now in Happy tails and may help someone choose to adopt.</Text>
          <StoryCard story={myStoryCard(posted, user)} />
        </ScrollView>
        <View style={styles.bottom}>
          <PrimaryButton title="Share with friends" onPress={() => shareStory(posted)} />
          <SecondaryButton title="Back to Home" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Happy tails" />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        <PageHeading title="Share your story" subtitle="Show how your pet is doing at home." />

        <Pressable style={[styles.photo, photoError && { borderColor: colors.error }]} onPress={choosePhoto}>
          {photo ? (
            <>
              <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} contentFit="cover" />
              <View style={styles.photoEdit}>
                <Ionicons name="camera" size={16} color={colors.white} />
                <Text style={styles.photoEditText}>Change</Text>
              </View>
            </>
          ) : (
            <>
              <Ionicons name="image-outline" size={32} color={colors.purple} />
              <Text style={styles.photoText}>Add a photo of your pet at home</Text>
            </>
          )}
        </Pressable>

        <FormField
          label="Pet’s name"
          placeholder="Nala"
          icon={require('../../../assets/figma/q-paw.svg')}
          value={petName}
          onChangeText={setPetName}
          error={nameError}
        />
        <ChoiceField label="Adopted from" options={shelters} value={shelter} onChange={setShelter} />
        <ChoiceField label="When" options={whens} value={when} onChange={setWhen} />
        <View style={{ gap: 4 }}>
          <TextArea
            label="Your story"
            placeholder="She was shy at first. Now she sleeps on my feet every night."
            value={text}
            onChangeText={(t) => setText(t.slice(0, MAX))}
          />
          <Text style={[styles.counter, textError && { color: colors.error }]}>
            {textError ? 'Write at least a sentence.' : `${text.length}/${MAX}`}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <PrimaryButton title="Post my story" onPress={post} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingBottom: 24, gap: 20 },
  photo: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.purpleSelected,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoText: { fontFamily: fonts.medium, fontSize: 14, color: colors.purple },
  photoEdit: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(27,27,27,0.6)',
  },
  photoEditText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.white },
  counter: { fontFamily: fonts.medium, fontSize: 12, color: colors.grey, textAlign: 'right' },
  done: { alignItems: 'center', padding: 24, gap: 12 },
  doneTitle: { fontFamily: fonts.extraBold, fontSize: 26, color: colors.black },
  doneText: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.grey, textAlign: 'center', marginBottom: 8 },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 8 },
});
