import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Tag } from '@/components/PetRow';
import { Chip, FormField, Icon, NavHeader, PrimaryButton } from '@/components/ui';
import { getProfile } from '@/data/profiles';
import { isValidEmail, useApp } from '@/store';
import { matchScore } from '@/lib/match';
import { colors, fonts } from '@/theme';

export default function Meeting() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = getProfile(id);
  const { apply, user, setUser, preferences } = useApp();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [contact, setContact] = useState('Phone');
  const [consent, setConsent] = useState(true);
  const [message, setMessage] = useState(
    `I’m ready to discuss long-term care and would love to meet ${pet.name} this week.`,
  );

  const nameError = submitted && !name.trim() && 'Please enter your name.';
  const phoneError = submitted && contact === 'Phone' && phone.trim().length < 6 && 'Add a phone number we can call.';
  const emailError = submitted && !isValidEmail(email) && 'Please enter a valid email.';

  const send = () => {
    setSubmitted(true);
    if (!name.trim() || !isValidEmail(email) || (contact === 'Phone' && phone.trim().length < 6)) return;
    // Remember the details so the next form is already filled in.
    setUser({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined });
    apply(pet.id);
    router.replace({ pathname: '/application-sent', params: { id: pet.id } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step={pet.shelter} />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View style={{ gap: 8 }}>
          <Text style={styles.title}>Your first meeting</Text>
          <Text style={styles.subtitle}>
            Tell {pet.shelter} a little about you. They usually reply within 2 working days.
          </Text>
        </View>

        <View style={styles.summary}>
          <Image source={pet.thumb} style={styles.photo} contentFit="cover" />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petMeta}>
              {pet.shelter} shelter · {pet.distance}
            </Text>
          </View>
          <Tag label={`${matchScore(pet, preferences)}% match`} />
        </View>

        <View style={{ gap: 12 }}>
          <Text style={styles.sectionTitle}>Your contact details</Text>
          <FormField
            label="Full name"
            placeholder="Anna Kovalenko"
            icon={require('../../../assets/figma/field-user.svg')}
            autoComplete="name"
            value={name}
            onChangeText={setName}
            error={nameError}
          />
          <FormField
            label="Phone"
            placeholder="+49 160 000 00 00"
            icon={require('../../../assets/figma/field-user.svg')}
            keyboardType="phone-pad"
            autoComplete="tel"
            value={phone}
            onChangeText={setPhone}
            error={phoneError}
          />
          <FormField
            label="Email"
            placeholder="anna@example.com"
            icon={require('../../../assets/figma/field-mail.svg')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={styles.label}>Preferred contact</Text>
          <View style={styles.row}>
            {['Phone', 'Email'].map((c) => (
              <Chip key={c} label={c} selected={contact === c} onPress={() => setContact(c)} />
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={styles.label}>Message · optional</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            style={styles.textarea}
            textAlignVertical="top"
          />
        </View>

        <Pressable style={styles.consent} onPress={() => setConsent((c) => !c)}>
          <View style={[styles.checkbox, !consent && styles.checkboxOff]}>
            {consent && <Icon source={require('../../../assets/figma/check-white.svg')} size={16} />}
          </View>
          <Text style={styles.consentText}>{pet.shelter} may contact me about this meeting.</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title="Send meeting application"
          onPress={consent ? send : undefined}
          style={!consent && { opacity: 0.5 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, gap: 24 },
  title: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.black },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22, color: colors.grey },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  photo: { width: 56, height: 56, borderRadius: 8, backgroundColor: colors.greyBg },
  petName: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.black },
  petMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  label: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  row: { flexDirection: 'row', gap: 8 },
  textarea: {
    height: 112,
    padding: 16,
    paddingTop: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    backgroundColor: colors.white,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.black,
  },
  consent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { padding: 2, borderRadius: 6, backgroundColor: colors.purple },
  checkboxOff: { width: 20, height: 20, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.grey1 },
  consentText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
