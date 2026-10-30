import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const TEXT_H = 150;
const FOOTER_H = 124;
const HOLD_MS = 900;

const slides = [
  {
    title: 'Find a friend who fits your life',
    text: 'Tell us about your routine and we’ll match you with pets who’ll love it.',
    mascot: require('../../assets/mascots/dog.png'),
    photos: [require('../../assets/pets/maxi.jpg'), require('../../assets/pets/luna.jpg')],
    color: colors.lime,
  },
  {
    title: 'Help without adopting',
    text: 'Feed a named pet’s care fund and watch them get better.',
    mascot: require('../../assets/mascots/cat.png'),
    photos: [require('../../assets/pets/milo.jpg'), require('../../assets/pets/ginger.jpg')],
    color: colors.pink,
  },
  {
    title: 'Found a pet? We’ve got you',
    text: 'A photo and a pin on the map. Nearby shelters take it from there.',
    mascot: require('../../assets/mascots/rabbit.png'),
    photos: [require('../../assets/pets/snowball.jpg'), require('../../assets/pets/kiwi.jpg')],
    color: colors.yellow,
  },
];

// First-launch walkthrough: the mascots on splash colours, and a "give a paw" hold to begin.
export default function Intro() {
  const { finishIntro } = useApp();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [scroller, setScroller] = useState<ScrollViewInstance | null>(null);
  const [page, setPage] = useState(0);
  const [scrollX] = useState(() => new Animated.Value(0));
  const [bob] = useState(() => new Animated.Value(0));
  const last = page === slides.length - 1;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);

  const done = () => {
    finishIntro();
    router.replace('/welcome');
  };
  const goTo = (i: number) => scroller?.scrollTo({ x: width * i, animated: true });
  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== page) Haptics.selectionAsync().catch(() => {});
    setPage(next);
  };
  const rangeFor = (i: number) => [(i - 1) * width, i * width, (i + 1) * width];

  return (
    <View style={styles.container}>
      {/* Background colour cross-fades between slides. */}
      {slides.map((s, i) => (
        <Animated.View
          key={s.title}
          style={[
            styles.fill,
            {
              backgroundColor: s.color,
              opacity: scrollX.interpolate({ inputRange: rangeFor(i), outputRange: [0, 1, 0], extrapolate: 'clamp' }),
            },
          ]}
        />
      ))}
      <View style={[styles.sheet, { height: TEXT_H + FOOTER_H + insets.bottom }]} />

      <View style={[styles.top, { marginTop: insets.top }]}>
        <View style={styles.brand}>
          <Ionicons name="paw" size={18} color={colors.purple} />
          <Text style={styles.brandText}>4 Paws</Text>
        </View>
        {!last && (
          <Pressable onPress={done} hitSlop={12} style={styles.skip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>

      <Animated.ScrollView
        ref={setScroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        style={{ marginBottom: FOOTER_H + insets.bottom }}
      >
        {slides.map((slide, i) => {
          const range = rangeFor(i);
          const parallax = (d: number) =>
            scrollX.interpolate({ inputRange: range, outputRange: [d, 0, -d], extrapolate: 'clamp' });
          return (
            <View key={slide.title} style={{ width }}>
              <View style={styles.stage}>
                <View style={styles.sun} />
                <Animated.View style={[styles.photo, styles.photoLeft, { transform: [{ translateX: parallax(-60) }, { rotate: '-10deg' }] }]}>
                  <Image source={slide.photos[0]} style={styles.fill} contentFit="cover" />
                </Animated.View>
                <Animated.View style={[styles.photo, styles.photoRight, { transform: [{ translateX: parallax(-30) }, { rotate: '8deg' }] }]}>
                  <Image source={slide.photos[1]} style={styles.fill} contentFit="cover" />
                </Animated.View>
                <Animated.View
                  style={{
                    transform: [
                      { translateX: parallax(width * 0.5) },
                      { translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -14] }) },
                    ],
                  }}
                >
                  <Image source={slide.mascot} style={styles.mascot} contentFit="contain" />
                </Animated.View>
                <Animated.View
                  style={[
                    styles.shadow,
                    { transform: [{ scaleX: bob.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] }) }] },
                  ]}
                />
              </View>
              <Animated.View
                style={[
                  styles.copy,
                  {
                    opacity: scrollX.interpolate({ inputRange: range, outputRange: [0, 1, 0], extrapolate: 'clamp' }),
                    transform: [{ translateY: scrollX.interpolate({ inputRange: range, outputRange: [20, 0, 20], extrapolate: 'clamp' }) }],
                  },
                ]}
              >
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.text}>{slide.text}</Text>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      <View style={[styles.footer, { height: FOOTER_H, bottom: insets.bottom }]}>
        <PawTrail scrollX={scrollX} width={width} onPress={goTo} />
        {last ? <HoldToStart onDone={done} /> : <NextButton onPress={() => goTo(page + 1)} />}
      </View>
    </View>
  );
}

// Progress as a little trail of paw prints that fill in as you go.
function PawTrail({ scrollX, width, onPress }: { scrollX: Animated.Value; width: number; onPress: (i: number) => void }) {
  return (
    <View style={styles.trail}>
      {slides.map((s, i) => (
        <Pressable key={s.title} onPress={() => onPress(i)} hitSlop={8} accessibilityLabel={`Slide ${i + 1}`}>
          <Ionicons name="paw" size={20} color={colors.greyOption} style={{ transform: [{ rotate: i % 2 ? '18deg' : '-18deg' }] }} />
          <Animated.View
            style={[
              styles.fill,
              {
                opacity: scrollX.interpolate({ inputRange: [(i - 1) * width, i * width], outputRange: [0, 1], extrapolate: 'clamp' }),
              },
            ]}
          >
            <Ionicons name="paw" size={20} color={colors.purple} style={{ transform: [{ rotate: i % 2 ? '18deg' : '-18deg' }] }} />
          </Animated.View>
        </Pressable>
      ))}
    </View>
  );
}

function NextButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Next</Text>
      <Ionicons name="arrow-forward" size={20} color={colors.white} />
    </Pressable>
  );
}

// "Give a paw": press and hold until the bar fills, like a promise to a new friend.
function HoldToStart({ onDone }: { onDone: () => void }) {
  const [fill] = useState(() => new Animated.Value(0));
  const [holding, setHolding] = useState(false);

  const pressIn = () => {
    setHolding(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    Animated.timing(fill, { toValue: 1, duration: HOLD_MS, easing: Easing.linear, useNativeDriver: false }).start(({ finished }) => {
      if (!finished) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onDone();
    });
  };
  const pressOut = () => {
    setHolding(false);
    Animated.timing(fill, { toValue: 0, duration: 250, useNativeDriver: false }).start();
  };

  return (
    <Pressable
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityLabel="Let’s start"
      onAccessibilityTap={onDone}
      style={[styles.button, styles.hold]}
    >
      <Animated.View
        style={[styles.holdFill, { width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
      />
      <Ionicons name="paw" size={20} color={colors.white} />
      <Text style={styles.buttonText}>{holding ? 'Keep holding…' : 'Hold to give a paw'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  top: {
    height: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandText: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.black },
  skip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.7)' },
  skipText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sun: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,255,255,0.55)' },
  photo: {
    position: 'absolute',
    width: 96,
    height: 112,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  photoLeft: { left: 22, top: '12%' },
  photoRight: { right: 24, bottom: '10%' },
  mascot: { width: 230, height: 230 },
  shadow: { width: 120, height: 14, borderRadius: 7, backgroundColor: 'rgba(27,27,27,0.08)', marginTop: 4 },
  copy: { height: TEXT_H, paddingHorizontal: 28, paddingTop: 28, gap: 8 },
  title: { fontFamily: fonts.extraBold, fontSize: 26, lineHeight: 32, color: colors.black, textAlign: 'center' },
  text: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.grey, textAlign: 'center' },
  footer: { position: 'absolute', left: 20, right: 20, gap: 18, justifyContent: 'center' },
  trail: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  button: {
    height: 56,
    borderRadius: 100,
    backgroundColor: colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  hold: { backgroundColor: colors.black },
  holdFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.purple },
  buttonText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.white },
});
