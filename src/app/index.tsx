import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/welcome'), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image source={require('../../assets/figma/logo.svg')} style={styles.logo} />
      <Text style={styles.title}>4 Paws</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logo: { width: 269, height: 269 },
  title: { fontFamily: fonts.extraBold, fontSize: 32, lineHeight: 35, color: colors.cream },
});
