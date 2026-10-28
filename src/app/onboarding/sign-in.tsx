import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, Icon, NavHeader, PageHeading, PrimaryButton } from '@/components/ui';
import { colors, fonts } from '@/theme';

export default function SignIn() {
  const [hidden, setHidden] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Step 3/3" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
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
          />
          <FormField
            label="Password"
            placeholder="Create a password"
            icon={require('../../../assets/figma/field-lock.svg')}
            hint="Use at least 8 characters."
            secureTextEntry={hidden}
            autoComplete="password"
            trailing={
              <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
                <Icon source={require('../../../assets/figma/field-eye.svg')} />
              </Pressable>
            }
          />
          <Text style={styles.forgot}>Forgot password?</Text>
        </View>
        <View style={styles.alt}>
          <Text style={styles.altText}>New to 4 Paws? </Text>
          <Pressable onPress={() => router.replace('/onboarding/create-account')}>
            <Text style={[styles.altText, styles.link]}>Create an account</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton title="Continue" onPress={() => router.replace('/(tabs)')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  form: { paddingHorizontal: 16, gap: 16, marginTop: 20 },
  forgot: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black, marginTop: -4 },
  alt: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  altText: { fontFamily: fonts.regular, fontSize: 14, color: colors.black },
  link: { fontFamily: fonts.semiBold, textDecorationLine: 'underline' },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
