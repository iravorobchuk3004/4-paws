import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, Icon, NavHeader, PageHeading, PrimaryButton } from '@/components/ui';
import { colors, fonts } from '@/theme';

export default function CreateAccount() {
  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Step 2/3" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
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
          />
          <FormField
            label="Email address"
            placeholder="you@example.com"
            icon={require('../../../assets/figma/field-mail.svg')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <Text style={styles.or}>or</Text>

        <View style={styles.social}>
          <SocialButton label="Continue with Google" icon={require('../../../assets/figma/google.svg')} />
          <SocialButton label="Continue with Apple" icon={require('../../../assets/figma/apple.svg')} />
          <View style={styles.alt}>
            <Text style={styles.altText}>Already have an account? </Text>
            <Link href="/onboarding/sign-in" style={[styles.altText, styles.link]}>
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title="Create account & continue"
          onPress={() => router.push('/onboarding/about-you')}
        />
      </View>
    </SafeAreaView>
  );
}

function SocialButton({ label, icon }: { label: string; icon: number }) {
  return (
    <Pressable style={styles.socialButton} onPress={() => router.push('/onboarding/about-you')}>
      <Icon source={icon} />
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
    height: 56,
    borderRadius: 8,
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
});
