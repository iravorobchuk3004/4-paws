import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, Icon, NavHeader, PageHeading, PrimaryButton } from '@/components/ui';
import { finishOnboarding } from '@/lib/onboarding';
import { isValidEmail, useApp } from '@/store';
import { colors, fonts } from '@/theme';

export default function CreateAccount() {
  const { goal, setUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidden, setHidden] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameError = submitted && !name.trim() && 'Please enter your name.';
  const emailError = submitted && !isValidEmail(email) && 'Please enter a valid email.';
  const passwordError = submitted && password.length < 8 && 'Use at least 8 characters.';
  const termsError = submitted && !agreed;

  const submit = () => {
    setSubmitted(true);
    if (!name.trim() || !isValidEmail(email) || password.length < 8 || !agreed) return;
    setUser({ name: name.trim(), email: email.trim() });
    finishOnboarding(goal);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Step 2/3" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <PageHeading
          title="Create your account"
          subtitle="Save your favourites and find a companion who fits your life."
        />
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
            label="Password"
            placeholder="At least 8 characters"
            icon={require('../../../assets/figma/field-lock.svg')}
            hint="Use at least 8 characters."
            secureTextEntry={hidden}
            autoComplete="new-password"
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
          <Pressable style={styles.terms} onPress={() => setAgreed((a) => !a)} hitSlop={6}>
            <View style={[styles.checkbox, agreed && styles.checkboxOn, termsError && { borderColor: colors.error }]}>
              {agreed && <Icon source={require('../../../assets/figma/check-white.svg')} size={14} />}
            </View>
            <Text style={[styles.termsText, termsError && { color: colors.error }]}>
              I agree to the{' '}
              <Text style={styles.termsLink} onPress={() => router.push('/settings/help')}>
                Terms & Privacy Policy
              </Text>
            </Text>
          </Pressable>
        </View>

        <Text style={styles.or}>or</Text>

        <View style={styles.social}>
          <SocialButton label="Continue with Google" icon="logo-google" color="#4285F4" />
          <SocialButton label="Continue with Apple" icon="logo-apple" color={colors.black} />
          <View style={styles.alt}>
            <Text style={styles.altText}>Already have an account? </Text>
            <Link href="/onboarding/sign-in" style={[styles.altText, styles.link]}>
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton title="Create account & continue" onPress={submit} />
      </View>
    </SafeAreaView>
  );
}

// Social sign-in needs provider keys and a backend, so for now it points people to email.
function SocialButton({ label, icon, color }: { label: string; icon: 'logo-google' | 'logo-apple'; color: string }) {
  return (
    <Pressable
      style={styles.socialButton}
      onPress={() => Alert.alert(label, 'This option is coming soon. Please use your name and email for now.')}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  form: { paddingHorizontal: 16, gap: 12, marginTop: 20 },
  or: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    marginVertical: 8,
  },
  social: { paddingHorizontal: 16, gap: 12 },
  socialButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialText: { fontFamily: fonts.medium, fontSize: 14, color: colors.black },
  alt: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  altText: { fontFamily: fonts.regular, fontSize: 14, color: colors.black },
  link: { fontFamily: fonts.semiBold, textDecorationLine: 'underline' },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.grey1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.purple, borderColor: colors.purple },
  termsText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.black },
  termsLink: { fontFamily: fonts.semiBold, color: colors.purple, textDecorationLine: 'underline' },
});
