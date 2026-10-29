import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, NavHeader, PageHeading, PrimaryButton } from '@/components/ui';
import { isValidEmail, useApp } from '@/store';
import { colors, fonts } from '@/theme';

export default function EditAccount() {
  const { user, setUser } = useApp();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [photo, setPhoto] = useState(user?.photo);
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const pick = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow access in Settings to change your photo.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]);
      return;
    }
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [1, 1] };
    const result =
      source === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const changePhoto = () =>
    Alert.alert('Profile photo', undefined, [
      { text: 'Take photo', onPress: () => pick('camera') },
      { text: 'Choose from library', onPress: () => pick('library') },
      ...(photo ? [{ text: 'Remove photo', style: 'destructive' as const, onPress: () => setPhoto(undefined) }] : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  const [submitted, setSubmitted] = useState(false);

  const nameError = submitted && !name.trim() && 'Please enter your name.';
  const emailError = submitted && !isValidEmail(email) && 'Please enter a valid email.';

  const save = () => {
    setSubmitted(true);
    if (!name.trim() || !isValidEmail(email)) return;
    setUser({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, photo });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Profile" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <PageHeading title="Edit your details" subtitle="Shelters use these to reach you about meetings." />
        <Pressable style={styles.avatarWrap} onPress={changePhoto}>
          <View style={styles.avatar}>
            {photo ? (
              <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} contentFit="cover" />
            ) : (
              <Text style={styles.initials}>{initials || '🐾'}</Text>
            )}
          </View>
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={16} color={colors.white} />
          </View>
          <Text style={styles.changePhoto}>{photo ? 'Change photo' : 'Add photo'}</Text>
        </Pressable>
        <View style={styles.form}>
          <FormField
            label="Full name"
            placeholder="Your full name"
            icon={require('../../../assets/figma/field-user.svg')}
            autoComplete="name"
            value={name}
            onChangeText={setName}
            error={nameError}
          />
          <FormField
            label="Email address"
            placeholder="you@example.com"
            icon={require('../../../assets/figma/field-mail.svg')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
          />
          <FormField
            label="Phone · optional"
            placeholder="+49 160 000 00 00"
            icon={require('../../../assets/figma/field-user.svg')}
            keyboardType="phone-pad"
            autoComplete="tel"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <PrimaryButton title="Save changes" onPress={save} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  form: { paddingHorizontal: 16, gap: 12, marginTop: 20 },
  avatarWrap: { alignSelf: 'center', alignItems: 'center', gap: 8, marginTop: 20 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    backgroundColor: colors.purpleSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: fonts.bold, fontSize: 32, color: colors.purple },
  cameraBadge: {
    position: 'absolute',
    top: 64,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.purple,
    borderWidth: 3,
    borderColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhoto: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.purple },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
