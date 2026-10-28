import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceField, PageTitle, TextArea } from '@/components/form';
import { Icon, NavHeader, PrimaryButton } from '@/components/ui';
import { useFoundReport } from '@/components/FoundReport';
import { colors, fonts } from '@/theme';

const MAX_PHOTOS = 3;

export default function FoundStep1() {
  const { report, update } = useFoundReport();
  const valid = report.description.trim().length > 0;

  const addPhoto = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow access in Settings to add a photo.');
      return;
    }
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) update({ photos: [...report.photos, result.assets[0].uri].slice(0, MAX_PHOTOS) });
  };

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
                <Pressable
                  key={uri}
                  style={styles.photoSlot}
                  onLongPress={() => update({ photos: report.photos.filter((p) => p !== uri) })}
                >
                  <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                </Pressable>
              ) : (
                <Pressable
                  key={`add-${i}`}
                  style={[styles.photoSlot, styles.addSlot]}
                  onPress={() => addPhoto(i === report.photos.length ? 'camera' : 'library')}
                >
                  <Icon
                    source={
                      i === report.photos.length
                        ? require('../../../assets/figma/camera.svg')
                        : require('../../../assets/figma/plus-purple.svg')
                    }
                    size={22}
                  />
                  <Text style={styles.addText}>{i === report.photos.length ? 'Add photo' : 'Add'}</Text>
                </Pressable>
              ),
            )}
          </View>
          <Text style={styles.hint}>
            {report.photos.length} of {MAX_PHOTOS} added · avoid faces and car plates
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
          label="Description · required"
          placeholder="Brown medium-size dog, red collar, no tag. Friendly but cautious."
          value={report.description}
          onChangeText={(description) => update({ description })}
        />
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title="Continue to location"
          onPress={valid ? () => router.push('/found/location') : undefined}
          style={!valid && { opacity: 0.5 }}
        />
      </View>
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
  addText: { fontFamily: fonts.medium, fontSize: 12, color: colors.purple },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
