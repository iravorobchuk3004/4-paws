import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const confetti = require('../../assets/figma/confetti-cluster.svg');

// Confetti colours from the Figma clusters.
const COLORS = ['#6252CE', '#DCFA9D', '#FFB6D4', '#FFF369'];
const PIECES = 36;
const BURST_MS = 1600;

// The static clusters from the design, popped in one after another.
const clusters = [
  { left: 185, top: -23, rotate: '0deg' },
  { left: 12, top: 74, rotate: '0deg' },
  { left: 190, top: 90, rotate: '120deg' },
  { left: 30, top: -10, rotate: '-160deg' },
];

type Piece = {
  dx: number;
  dy: number;
  fall: number;
  spin: number;
  size: number;
  round: boolean;
  color: string;
  delay: number;
};

function makePieces(): Piece[] {
  return Array.from({ length: PIECES }, (_, i) => {
    const angle = (i / PIECES) * Math.PI * 2 + Math.random() * 0.4;
    const distance = 90 + Math.random() * 110;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance * 0.8 - 40,
      fall: 60 + Math.random() * 90,
      spin: (Math.random() - 0.5) * 900,
      size: 6 + Math.random() * 8,
      round: Math.random() > 0.4,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 120,
    };
  });
}

export type Critter = 'dog' | 'cat' | 'rabbit' | 'bird';

// Maps a pet kind or a found-report choice ("Dog", "Cat", "Other") to the happy animal to show.
export const critterFor = (kind?: string, categories: string[] = []): Critter => {
  const k = kind?.toLowerCase();
  if (categories.includes('Birds')) return 'bird';
  return k === 'cat' ? 'cat' : k === 'other' ? 'rabbit' : 'dog';
};

// A happy animal with a confetti burst, used on success screens.
export function Celebration({ animal = 'dog' }: { animal?: Critter }) {
  const [pieces] = useState(makePieces);
  const burst = useState(() => pieces.map(() => new Animated.Value(0)))[0];
  const clusterIn = useState(() => clusters.map(() => new Animated.Value(0)))[0];

  useEffect(() => {
    Animated.parallel(
      burst.map((v, i) =>
        Animated.timing(v, {
          toValue: 1,
          duration: BURST_MS,
          delay: pieces[i].delay,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    ).start();

    Animated.stagger(
      120,
      clusterIn.map((v) => Animated.spring(v, { toValue: 1, friction: 5, useNativeDriver: true })),
    ).start();

  }, [burst, clusterIn, pieces]);

  return (
    <View style={styles.illustration} pointerEvents="none">
      {clusters.map((c, i) => (
        <Animated.View
          key={i}
          style={[
            styles.cluster,
            {
              left: c.left,
              top: c.top,
              opacity: clusterIn[i],
              transform: [{ rotate: c.rotate }, { scale: clusterIn[i] }],
            },
          ]}
        >
          <Image source={confetti} style={StyleSheet.absoluteFill} />
        </Animated.View>
      ))}

      <HappyPet animal={animal} />

      {pieces.map((p, i) => {
        const t = burst[i];
        return (
          <Animated.View
            key={i}
            style={[
              styles.piece,
              {
                width: p.size,
                height: p.round ? p.size : p.size * 0.5,
                borderRadius: p.round ? p.size / 2 : 2,
                backgroundColor: p.color,
                opacity: t.interpolate({ inputRange: [0, 0.1, 0.75, 1], outputRange: [0, 1, 1, 0] }),
                transform: [
                  { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] }) },
                  {
                    // Shoot out, then drift down as if pulled by gravity.
                    translateY: t.interpolate({
                      inputRange: [0, 0.45, 1],
                      outputRange: [0, p.dy, p.dy + p.fall],
                    }),
                  },
                  { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.spin}deg`] }) },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  illustration: { width: 333, height: 215, alignSelf: 'center' },
  cluster: { position: 'absolute', width: 123, height: 124 },
  pet: { position: 'absolute', left: 0, right: 0, top: 40, alignItems: 'center' },
  mascot: { width: 120, height: 150 },
  piece: { position: 'absolute', left: 166, top: 100 },
});

// Watercolour mascots from the Figma "maskots" frame (all face right). No bird mascot yet, so birds use the rabbit.
const MASCOT: Record<Critter, number> = {
  dog: require('../../assets/mascots/dog.png'),
  cat: require('../../assets/mascots/cat.png'),
  rabbit: require('../../assets/mascots/rabbit.png'),
  bird: require('../../assets/mascots/rabbit.png'),
};

const loopOf = (...steps: Animated.CompositeAnimation[]) => Animated.loop(Animated.sequence(steps));
const to = (v: Animated.Value, toValue: number, duration: number, easing = Easing.inOut(Easing.quad)) =>
  Animated.timing(v, { toValue, duration, easing, useNativeDriver: true });

// The star of the celebration:
// dog runs back and forth, hopping and wagging; cat leaps with a flip; rabbit hops; bird flutters.
function HappyPet({ animal }: { animal: Critter }) {
  const [pop] = useState(() => new Animated.Value(0));
  const [x] = useState(() => new Animated.Value(0));
  const [face] = useState(() => new Animated.Value(1));
  const [y] = useState(() => new Animated.Value(0));
  const [wag] = useState(() => new Animated.Value(0));
  const [squash] = useState(() => new Animated.Value(1));
  const [flip] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
    const loops: Animated.CompositeAnimation[] = [];

    if (animal === 'dog') {
      // Run right, turn, run left, turn.
      loops.push(
        loopOf(
          to(face, 1, 0),
          to(x, 70, 1100),
          to(face, -1, 0),
          to(x, -70, 1400),
          to(face, 1, 0),
          to(x, 0, 700),
          Animated.delay(250),
        ),
        loopOf(to(y, -16, 160, Easing.out(Easing.quad)), to(y, 0, 160, Easing.in(Easing.quad))),
        loopOf(to(wag, 1, 130), to(wag, -1, 130)),
      );
    } else if (animal === 'cat') {
      loops.push(
        loopOf(
          to(squash, 0.8, 220),
          Animated.parallel([to(squash, 1.1, 180), to(y, -80, 380, Easing.out(Easing.quad)), to(flip, 1, 600)]),
          Animated.parallel([to(squash, 1, 200), to(y, 0, 320, Easing.in(Easing.quad))]),
          to(squash, 0.85, 90),
          to(squash, 1, 160),
          to(flip, 0, 0),
          Animated.delay(500),
        ),
        loopOf(to(wag, 0.4, 600), to(wag, -0.4, 600)),
      );
    } else if (animal === 'rabbit') {
      loops.push(
        loopOf(
          to(squash, 0.85, 120),
          Animated.parallel([to(squash, 1.05, 120), to(y, -40, 260, Easing.out(Easing.quad))]),
          Animated.parallel([to(squash, 1, 120), to(y, 0, 240, Easing.in(Easing.quad))]),
          Animated.delay(120),
        ),
        loopOf(to(x, 30, 900), to(x, -30, 1800), to(x, 0, 900)),
      );
    } else {
      loops.push(loopOf(to(y, -24, 500), to(y, 0, 500)), loopOf(to(wag, 1, 140), to(wag, -1, 140)));
    }
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [animal, face, flip, pop, squash, wag, x, y]);

  return (
    <Animated.View
      style={[
        styles.pet,
        {
          transform: [
            { translateX: x },
            { translateY: y },
            { scale: pop },
            { scaleX: face },
            { scaleY: squash },
            { rotate: flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] }) },
            { rotate: wag.interpolate({ inputRange: [-1, 1], outputRange: ['-6deg', '6deg'] }) },
          ],
        },
      ]}
    >
      <Image source={MASCOT[animal]} style={styles.mascot} contentFit="contain" />
    </Animated.View>
  );
}
