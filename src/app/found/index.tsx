import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router, usePreventRemove } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceField, PageTitle, TextArea } from '@/components/form';
import { Icon, NavHeader, PrimaryButton } from '@/components/ui';
import { useFoundReport } from '@/components/FoundReport';
import { colors, fonts } from '@/theme';

const MAX_PHOTOS = 3;

export default function FoundStep1() {
  const { report, update } = useFoundReport();
  const [preview, setPreview] = useState<number | null>(null);
  const hasDraft = report.photos.length > 0 || report.description.trim().length > 0;

  // Ask before throwing away a half-filled report.
  usePreventRemove(hasDraft && !report.submitted, ({ repeat }) =>
    Alert.alert('Discard this report?', 'The photos and details you added will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: repeat },
    ]),
  );

  const pick = async (source: 'camera' | 'library', limit: number) => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', `Allow ${source === 'camera' ? 'camera' : 'photo'} access in Settings to add a photo.`, [
        { text: 'Not now', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]);
      return [];
    }
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      quality: 0.7,
      allowsMultipleSelection: limit > 1,
      selectionLimit: limit,
    };
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    return result.canceled ? [] : result.assets.map((a) => a.uri);
  };

  const chooseSource = (onPick: (source: 'camera' | 'library') => void) =>
    Alert.alert('Add a photo', undefined, [
      { text: 'Take photo', onPress: () => onPick('camera') },
      { text: 'Choose from library', onPress: () => onPick('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);

  const addPhotos = () =>
    chooseSource(async (source) => {
      const uris = await pick(source, MAX_PHOTOS - report.photos.length);
      if (uris.length) update({ photos: [...report.photos, ...uris].slice(0, MAX_PHOTOS) });
    });

  const replacePhoto = (index: number) =>
    chooseSource(async (source) => {
      const [uri] = await pick(source, 1);
      if (uri) update({ photos: report.photos.map((p, i) => (i === index ? uri : p)) });
    });

  const removePhoto = (index: number) =>
    Alert.alert('Delete this photo?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setPreview(null);
          update({ photos: report.photos.filter((_, i) => i !== index) });
        },
      },
    ]);

  const slots = Array.from({ length: MAX_PHOTOS }, (_, i) => report.photos[i]);

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Step 1/3" />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <PageTitle
          title="Tell us about the pet"
          subtitle="Photos and a short description help the shelter prepare."
        />

        <View style={{ gap: 8 }}>
          <Text style={styles.label}>Photos</Text>
          <View style={styles.photoRow}>
            {slots.map((uri, i) =>
              uri ? (
                <Pressable key={uri} style={styles.photoSlot} onPress={() => setPreview(i)}>
                  <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <Pressable style={styles.trash} onPress={() => removePhoto(i)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={16} color={colors.white} />
                  </Pressable>
                </Pressable>
              ) : i === report.photos.length ? (
                <Pressable key="add" style={[styles.photoSlot, styles.addSlot]} onPress={addPhotos}>
                  <Icon source={require('../../../assets/figma/camera.svg')} size={22} />
                  <Text style={styles.addText}>Add photo</Text>
                </Pressable>
              ) : (
                <View key={`empty-${i}`} style={[styles.photoSlot, styles.emptySlot]} />
              ),
            )}
          </View>
          <Text style={styles.hint}>
            {report.photos.length} of {MAX_PHOTOS} added · tap a photo to view, replace or delete it
          </Text>
        </View>

        <View style={{ gap: 20 }}>
          <ChoiceField
            label="Animal type"
            options={['Dog', 'Cat', 'Other']}
            value={report.animal}
            onChange={(animal) => update({ animal })}
          />
          <ChoiceField
            label="Visible condition"
            options={['No visible injury', 'Injured', 'Not sure']}
            value={report.condition}
            onChange={(condition) => update({ condition })}
          />
          <ChoiceField
            label="Behaviour"
            options={['Calm', 'Scared', 'Not sure']}
            value={report.behaviour}
            onChange={(behaviour) => update({ behaviour })}
          />
        </View>

        <TextArea
          label="Description · optional"
          placeholder="Brown medium-size dog, red collar, no tag. Friendly but cautious."
          value={report.description}
          onChangeText={(description) => update({ description })}
        />
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title="Continue to location"
          onPress={() => router.push('/found/location')}
        />
      </View>

      <Modal visible={preview !== null} animationType="fade" transparent onRequestClose={() => setPreview(null)}>
        {preview !== null && report.photos[preview] && (
          <View style={styles.viewer}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.viewerTop}>
                <Text style={styles.viewerCount}>
                  Photo {preview + 1} of {report.photos.length}
                </Text>
                <Pressable onPress={() => setPreview(null)} hitSlop={12} style={styles.viewerClose}>
                  <Ionicons name="close" size={22} color={colors.white} />
                </Pressable>
              </View>
              <Image source={{ uri: report.photos[preview] }} style={{ flex: 1 }} contentFit="contain" />
              <View style={styles.viewerActions}>
                <Pressable style={styles.viewerButton} onPress={() => replacePhoto(preview)}>
                  <Ionicons name="swap-horizontal" size={20} color={colors.white} />
                  <Text style={styles.viewerButtonText}>Replace</Text>
                </Pressable>
                <Pressable style={[styles.viewerButton, styles.viewerDelete]} onPress={() => removePhoto(preview)}>
                  <Ionicons name="trash-outline" size={20} color={colors.white} />
                  <Text style={styles.viewerButtonText}>Delete</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, gap: 24 },
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.black },
  photoRow: { flexDirection: 'row', gap: 8 },
  photoSlot: { flex: 1, height: 104, borderRadius: 20, overflow: 'hidden', backgroundColor: colors.greyBg },
  addSlot: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.purpleBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptySlot: { backgroundColor: 'transparent', borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.greyBg },
  trash: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(27,27,27,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.94)' },
  viewerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  viewerCount: { fontFamily: fonts.medium, fontSize: 15, color: colors.white },
  viewerClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerActions: { flexDirection: 'row', gap: 12, padding: 20 },
  viewerButton: {
    flex: 1,
    height: 52,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  viewerDelete: { backgroundColor: colors.error },
  viewerButtonText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.white },
  addText: { fontFamily: fonts.medium, fontSize: 12, color: colors.purple },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
