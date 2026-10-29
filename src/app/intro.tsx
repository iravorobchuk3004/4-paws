import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const slides = [
  {
    title: 'Find a friend who fits your life',
    text: 'Tell us about your home and routine, and we match you with animals that will be happy with you.',
    image: require('../../assets/figma/luna-hero.jpg'),
  },
  {
    title: 'Support an animal’s care',
    text: 'Not ready to adopt? Give to a named animal’s care fund and follow how they get better.',
    image: require('../../assets/figma/care-bella.jpg'),
  },
  {
    title: 'Found a pet? We’ll help',
    text: 'Share a photo and the place in three short steps. Shelters and volunteers nearby get your request.',
    image: require('../../assets/figma/found-photo.jpg'),
  },
];

// First-launch walkthrough shown once, between the splash and the welcome screen.
export default function Intro() {
  const { finishIntro } = useApp();
  const { width } = useWindowDimensions();
  const [scroller, setScroller] = useState<ScrollViewInstance | null>(null);
  const [page, setPage] = useState(0);
  const [scrollX] = useState(() => new Animated.Value(0));
  const last = page === slides.length - 1;

  const done = () => {
    finishIntro();
    router.replace('/welcome');
  };
  const next = () => (last ? done() : scroller?.scrollTo({ x: width * (page + 1), animated: true }));
  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.counter}>
          {page + 1}/{slides.length}
        </Text>
        {!last && (
          <Pressable onPress={done} hitSlop={12}>
            <Text style={styles.skip}>Skip</Text>
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
      >
        {slides.map((slide, i) => {
          const range = [(i - 1) * width, i * width, (i + 1) * width];
          return (
            <View key={slide.title} style={[styles.slide, { width }]}>
              <Animated.View
                style={[
                  styles.imageWrap,
                  {
                    height: Math.min(420, width - 48),
                    transform: [
                      { scale: scrollX.interpolate({ inputRange: range, outputRange: [0.85, 1, 0.85], extrapolate: 'clamp' }) },
                      { rotate: scrollX.interpolate({ inputRange: range, outputRange: ['-6deg', '0deg', '6deg'], extrapolate: 'clamp' }) },
                    ],
                  },
                ]}
              >
                <Image source={slide.image} style={StyleSheet.absoluteFill} contentFit="cover" />
              </Animated.View>
              <Animated.View
                style={{
                  gap: 8,
                  opacity: scrollX.interpolate({ inputRange: range, outputRange: [0, 1, 0], extrapolate: 'clamp' }),
                }}
              >
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.text}>{slide.text}</Text>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.dots}>
        {slides.map((s, i) => (
          <Animated.View
            key={s.title}
            style={[
              styles.dot,
              {
                opacity: scrollX.interpolate({
                  inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.bottom}>
        <PrimaryButton title={last ? 'Let’s start' : 'Next'} onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  top: {
    height: 42,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: { fontFamily: fonts.medium, fontSize: 14, color: colors.grey },
  skip: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.purple },
  slide: { paddingHorizontal: 24, paddingTop: 16, gap: 28 },
  imageWrap: { borderRadius: 32, overflow: 'hidden', backgroundColor: colors.purpleTint },
  title: { fontFamily: fonts.extraBold, fontSize: 28, lineHeight: 36, color: colors.black, textAlign: 'center' },
  text: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23, color: colors.grey, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.purple },
  bottom: { paddingHorizontal: 20, paddingBottom: 8 },
});
