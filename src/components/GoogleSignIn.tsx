import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/ui';
import { isValidEmail, User } from '@/store';
import { colors, fonts } from '@/theme';

const DEMO = { name: 'Alex Kim', email: 'alex.kim@gmail.com' };

const nameFromEmail = (email: string) =>
  email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

// Real Google sign-in needs a development build and Google Cloud client IDs, so in Expo Go
// the button opens a simulated account picker instead. The screen renders <GoogleSheet>
// at its root so the sheet covers the whole screen.
export function GoogleButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="logo-google" size={20} color="#4285F4" />
      <Text style={styles.buttonText}>Continue with Google</Text>
    </Pressable>
  );
}

export function GoogleSheet({ onClose, onPick }: { onClose: () => void; onPick: (user: User) => void }) {
  const [connecting, setConnecting] = useState(true);
  const [other, setOther] = useState(false);
  const [email, setEmail] = useState('');
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setConnecting(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const useOther = () => {
    setTried(true);
    if (isValidEmail(email)) onPick({ name: nameFromEmail(email), email: email.trim() });
  };

  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
      <View style={styles.sheet}>
        <View style={styles.head}>
          <Ionicons name="logo-google" size={24} color="#4285F4" />
          <Text style={styles.title}>{connecting ? 'Connecting…' : 'Choose an account'}</Text>
          <Text style={styles.subtitle}>to continue to 4 Paws</Text>
        </View>

        {connecting ? (
          <ActivityIndicator color={colors.purple} style={{ marginVertical: 32 }} />
        ) : (
          <View style={styles.list}>
            <Pressable style={styles.account} onPress={() => onPick(DEMO)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AK</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.accountName}>{DEMO.name}</Text>
                <Text style={styles.accountEmail}>{DEMO.email}</Text>
              </View>
            </Pressable>
            <View style={styles.divider} />
            {other ? (
              <View style={{ gap: 10 }}>
                <TextInput
                  autoFocus
                  placeholder="Your Gmail address"
                  placeholderTextColor={colors.grey1}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                  onSubmitEditing={useOther}
                  style={[styles.input, tried && !isValidEmail(email) && { borderColor: colors.error }]}
                />
                <PrimaryButton title="Continue" onPress={useOther} />
              </View>
            ) : (
              <Pressable style={styles.account} onPress={() => setOther(true)}>
                <View style={[styles.avatar, { backgroundColor: colors.greyBg }]}>
                  <Ionicons name="person-add-outline" size={18} color={colors.grey} />
                </View>
                <Text style={styles.accountName}>Use another account</Text>
              </Pressable>
            )}
          </View>
        )}

        <Text style={styles.note}>Demo sign-in · nothing leaves your phone</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.greyOption,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.black },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(27,27,27,0.4)',
  },
  sheet: {
    padding: 24,
    paddingBottom: 40,
    gap: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.white,
  },
  head: { alignItems: 'center', gap: 6 },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey },
  list: { gap: 12 },
  account: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  accountName: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.black },
  accountEmail: { fontFamily: fonts.regular, fontSize: 13, color: colors.grey },
  divider: { height: 1, backgroundColor: colors.greyBg },
  input: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.greyOption,
    paddingHorizontal: 16,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.black,
  },
  note: { fontFamily: fonts.medium, fontSize: 12, color: colors.grey1, textAlign: 'center' },
});
