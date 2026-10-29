import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, NavHeader, PageHeading, PrimaryButton } from '@/components/ui';
import { isValidEmail, useApp } from '@/store';
import { colors } from '@/theme';

export default function EditAccount() {
  const { user, setUser } = useApp();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [submitted, setSubmitted] = useState(false);

  const nameError = submitted && !name.trim() && 'Please enter your name.';
  const emailError = submitted && !isValidEmail(email) && 'Please enter a valid email.';

  const save = () => {
    setSubmitted(true);
    if (!name.trim() || !isValidEmail(email)) return;
    setUser({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined });
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
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
