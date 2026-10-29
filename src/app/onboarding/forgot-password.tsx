import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, NavHeader, PageHeading, PrimaryButton } from '@/components/ui';
import { isValidEmail } from '@/store';
import { colors } from '@/theme';

export default function ForgotPassword() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [submitted, setSubmitted] = useState(false);
  const emailError = submitted && !isValidEmail(email) && 'Please enter a valid email.';

  // Demo: there is no server yet, so we go straight to the "check your inbox" step.
  const send = () => {
    setSubmitted(true);
    if (!isValidEmail(email)) return;
    router.replace({ pathname: '/onboarding/check-email', params: { email: email.trim() } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader />
      <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        <PageHeading
          title="Reset your password"
          subtitle="Enter the email you signed up with and we’ll send you a link to choose a new password."
        />
        <View style={styles.form}>
          <FormField
            label="Email address"
            placeholder="you@example.com"
            icon={require('../../../assets/figma/field-mail.svg')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoFocus={!params.email}
            value={email}
            onChangeText={setEmail}
            error={emailError}
            returnKeyType="send"
            onSubmitEditing={send}
          />
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <PrimaryButton title="Send reset link" onPress={send} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  form: { paddingHorizontal: 16, marginTop: 24 },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
