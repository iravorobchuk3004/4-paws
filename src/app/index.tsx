import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const TITLE = '4 Paws';
const RIPPLES = 3;

// Paw prints that walk up across the screen behind the logo.
const paws = [
  { left: '18%', top: '78%', rotate: '-20deg' },
  { left: '30%', top: '68%', rotate: '10deg' },
  { left: '20%', top: '58%', rotate: '-20deg' },
  { left: '72%', top: '30%', rotate: '20deg' },
  { left: '62%', top: '20%', rotate: '-10deg' },
  { left: '74%', top: '10%', rotate: '20deg' },
] as const;

export default function Splash() {
  const { loaded, user, seenIntro } = useApp();
  const [animDone, setAnimDone] = useState(false);
  const logoScale = useState(() => new Animated.Value(0))[0];
  const logoSpin = useState(() => new Animated.Value(0))[0];
  const pulse = useState(() => new Animated.Value(1))[0];
  const ripples = useState(() => Array.from({ length: RIPPLES }, () => new Animated.Value(0)))[0];
  const letters = useState(() => TITLE.split('').map(() => new Animated.Value(0)))[0];
  const pawSteps = useState(() => paws.map(() => new Animated.Value(0)))[0];
  const exit = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    const anim = Animated.sequence([
      // Logo spins in with a bouncy pop.
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
        Animated.timing(logoSpin, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.stagger(
          110,
          pawSteps.map((v) =>
            Animated.timing(v, { toValue: 1, duration: 300, useNativeDriver: true }),
          ),
        ),
      ]),
      // Title letters hop up one by one while ripples spread from the logo.
      Animated.parallel([
        Animated.stagger(
          70,
          letters.map((v) => Animated.spring(v, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true })),
        ),
        Animated.stagger(
          250,
          ripples.map((v) =>
            Animated.timing(v, { toValue: 1, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          ),
        ),
        // Heartbeat.
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.1, duration: 140, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 140, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1.08, duration: 140, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]),
      ]),
      Animated.delay(250),
      Animated.timing(exit, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]);
    anim.start(({ finished }) => finished && setAnimDone(true));
    return () => anim.stop();
  }, [exit, letters, logoScale, logoSpin, pawSteps, pulse, ripples]);

  // First launch shows the intro; returning users skip straight to Home.
  useEffect(() => {
    if (animDone && loaded) router.replace(user ? '/(tabs)' : seenIntro ? '/welcome' : '/intro');
  }, [animDone, loaded, user, seenIntro]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {paws.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.paw,
            {
              left: p.left,
              top: p.top,
              opacity: pawSteps[i].interpolate({ inputRange: [0, 1], outputRange: [0, 0.18] }),
              transform: [{ rotate: p.rotate }, { scale: pawSteps[i] }],
            },
          ]}
        >
          <Image source={require('../../assets/figma/logo.svg')} style={StyleSheet.absoluteFill} />
        </Animated.View>
      ))}

      <Animated.View style={[styles.content, { opacity: exit }]}>
        <View style={styles.logoWrap}>
          {ripples.map((v, i) => (
            <Animated.View
              key={i}
              style={[
                styles.ripple,
                {
                  opacity: v.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.35, 0] }),
                  transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.6] }) }],
                },
              ]}
            />
          ))}
          <Animated.View
            style={{
              transform: [
                { scale: Animated.multiply(logoScale, pulse) },
                { rotate: logoSpin.interpolate({ inputRange: [0, 1], outputRange: ['-180deg', '0deg'] }) },
              ],
            }}
          >
            <Image source={require('../../assets/figma/logo.svg')} style={styles.logo} />
          </Animated.View>
        </View>

        <View style={styles.titleRow}>
          {TITLE.split('').map((ch, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.title,
                {
                  opacity: letters[i],
                  transform: [{ translateY: letters[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
                },
              ]}
            >
              {ch === ' ' ? ' ' : ch}
            </Animated.Text>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', gap: 16 },
  logoWrap: { width: 269, height: 269, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 269, height: 269 },
  ripple: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: colors.cream,
  },
  titleRow: { flexDirection: 'row' },
  title: { fontFamily: fonts.extraBold, fontSize: 32, lineHeight: 40, color: colors.cream },
  paw: { position: 'absolute', width: 44, height: 44 },
});
