import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const TITLE = '4 Paws';

export default function Splash() {
  const { loaded, user, seenIntro } = useApp();
  const [animDone, setAnimDone] = useState(false);
  const [logoScale] = useState(() => new Animated.Value(0));
  const [logoSpin] = useState(() => new Animated.Value(0));
  const [wiggle] = useState(() => new Animated.Value(0));
  // Per letter: `step` stamps a paw print, `morph` turns that print into the letter.
  const [steps] = useState(() => TITLE.split('').map(() => new Animated.Value(0)));
  const [morphs] = useState(() => TITLE.split('').map(() => new Animated.Value(0)));
  const [exit] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const letters = TITLE.split('')
      .map((ch, i) => ({ ch, i }))
      .filter(({ ch }) => ch !== ' ');

    const anim = Animated.sequence([
      // Logo drops in and spins one and a half turns.
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
        Animated.timing(logoSpin, {
          toValue: 1,
          duration: 1100,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
      // A trail of paw prints walks in, then each print becomes a letter of the name.
      Animated.stagger(
        170,
        letters.map(({ i }) =>
          Animated.sequence([
            Animated.timing(steps[i], { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.delay(140),
            Animated.spring(morphs[i], { toValue: 1, friction: 5, tension: 160, useNativeDriver: true }),
          ]),
        ),
      ),
      // Happy little wiggle once the name is complete.
      Animated.sequence([
        Animated.timing(wiggle, { toValue: 1, duration: 110, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: -1, duration: 160, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 0.5, duration: 120, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 0, duration: 120, useNativeDriver: true }),
      ]),
      Animated.delay(350),
      Animated.timing(exit, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]);
    anim.start(({ finished }) => finished && setAnimDone(true));
    return () => anim.stop();
  }, [exit, logoScale, logoSpin, morphs, steps, wiggle]);

  // First launch shows the intro; returning users skip straight to Home.
  useEffect(() => {
    if (animDone && loaded) router.replace(user ? '/(tabs)' : seenIntro ? '/welcome' : '/intro');
  }, [animDone, loaded, user, seenIntro]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={[styles.content, { opacity: exit }]}>
        <Animated.View
          style={{
            transform: [
              { scale: logoScale },
              { rotate: logoSpin.interpolate({ inputRange: [0, 1], outputRange: ['-540deg', '0deg'] }) },
              { rotate: wiggle.interpolate({ inputRange: [-1, 1], outputRange: ['-12deg', '12deg'] }) },
            ],
          }}
        >
          <Image source={require('../../assets/figma/logo.svg')} style={styles.logo} />
        </Animated.View>

        <View style={styles.titleRow}>
          {TITLE.split('').map((ch, i) => {
            if (ch === ' ') return <View key={i} style={{ width: 10 }} />;
            const up = i % 2 === 0;
            return (
              <View key={i} style={styles.slot}>
                <Animated.View
                  style={[
                    styles.print,
                    {
                      opacity: Animated.multiply(steps[i], morphs[i].interpolate({ inputRange: [0, 0.6], outputRange: [1, 0], extrapolate: 'clamp' })),
                      transform: [
                        { translateY: up ? -8 : 8 },
                        { rotate: up ? '-18deg' : '18deg' },
                        { scale: steps[i].interpolate({ inputRange: [0, 1], outputRange: [1.8, 1] }) },
                      ],
                    },
                  ]}
                >
                  <FontAwesome6 name="paw" solid size={22} color={colors.cream} />
                </Animated.View>
                <Animated.Text
                  style={[
                    styles.title,
                    {
                      opacity: morphs[i],
                      transform: [
                        { translateY: morphs[i].interpolate({ inputRange: [0, 1], outputRange: [up ? -8 : 8, 0] }) },
                        { scale: morphs[i].interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
                      ],
                    },
                  ]}
                >
                  {ch}
                </Animated.Text>
              </View>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', gap: 8 },
  logo: { width: 220, height: 220 },
  titleRow: { flexDirection: 'row', alignItems: 'center', height: 56 },
  slot: { alignItems: 'center', justifyContent: 'center' },
  print: { position: 'absolute' },
  title: { fontFamily: fonts.extraBold, fontSize: 40, lineHeight: 50, color: colors.cream },
});
