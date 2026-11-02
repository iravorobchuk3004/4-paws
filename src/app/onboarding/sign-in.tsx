import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoogleButton, GoogleSheet } from '@/components/GoogleSignIn';
import { FormField, Icon, NavHeader, PageHeading, PrimaryButton } from '@/components/ui';
import { isValidEmail, useApp } from '@/store';
import { colors, fonts } from '@/theme';

const nameFromEmail = (email: string) => {
  const local = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return local.replace(/\b\w/g, (c) => c.toUpperCase()) || '4 Paws friend';
};

export default function SignIn() {
  const { user, setUser } = useApp();
  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [google, setGoogle] = useState(false);

  const emailError = submitted && !isValidEmail(email) && 'Please enter a valid email.';
  const passwordError = submitted && password.length < 8 && 'Use at least 8 characters.';

  const submit = () => {
    setSubmitted(true);
    if (!isValidEmail(email) || password.length < 8) return;
    // Demo sign-in: there is no server yet, so any valid email and password is accepted.
    const sameUser = user?.email.toLowerCase() === email.trim().toLowerCase();
    setUser(sameUser && user ? user : { name: nameFromEmail(email), email: email.trim() });
    router.dismissAll();
    router.replace('/(tabs)');
  };

  const forgot = () => router.push({ pathname: '/onboarding/forgot-password', params: { email: email.trim() } });

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <PageHeading
          title="Sign in to your account"
          subtitle="Your favourites and a new companion are waiting for you."
        />
        <View style={styles.form}>
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
            label="Password"
            placeholder="Your password"
            icon={require('../../../assets/figma/field-lock.svg')}
            hint="Use at least 8 characters."
            secureTextEntry={hidden}
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            returnKeyType="done"
            onSubmitEditing={submit}
            trailing={
              <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
                <Icon source={require('../../../assets/figma/field-eye.svg')} />
              </Pressable>
            }
          />
          <Pressable onPress={forgot} hitSlop={8} style={{ alignSelf: 'flex-start' }}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>
          <Text style={styles.or}>or</Text>
          <GoogleButton onPress={() => setGoogle(true)} />
        </View>
        <View style={styles.alt}>
          <Text style={styles.altText}>New to 4 Paws? </Text>
          <Pressable onPress={() => router.replace('/onboarding/create-account')}>
            <Text style={[styles.altText, styles.link]}>Create an account</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton title="Continue" onPress={submit} />
      </View>

      {google && (
        <GoogleSheet
          onClose={() => setGoogle(false)}
          onPick={(account) => {
            setGoogle(false);
            setUser(account);
            router.dismissAll();
            router.replace('/(tabs)');
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  form: { paddingHorizontal: 16, gap: 16, marginTop: 20 },
  or: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey, textAlign: 'center' },
  forgot: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black, marginTop: -4 },
  alt: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  altText: { fontFamily: fonts.regular, fontSize: 14, color: colors.black },
  link: { fontFamily: fonts.semiBold, textDecorationLine: 'underline' },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
