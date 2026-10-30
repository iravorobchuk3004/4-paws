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

type Part = 'tail' | 'front' | 'front2' | 'back' | 'ear';
type Mascot = { size: [number, number]; body: number; parts: { part: Part; image: number; pivot: [number, number] }[] };

// Watercolour mascots from the Figma "maskots" frame (all face right), cut into layers so the
// tail, paws and ears can move on their own. Pivots are the joints, in source-image pixels.
// No bird mascot yet, so birds use the rabbit.
const DOG: Mascot = {
  size: [480, 600],
  body: require('../../assets/mascots/dog/body.png'),
  parts: [
    { part: 'tail', image: require('../../assets/mascots/dog/tail.png'), pivot: [148, 338] },
    { part: 'back', image: require('../../assets/mascots/dog/back.png'), pivot: [112, 395] },
    { part: 'front', image: require('../../assets/mascots/dog/front.png'), pivot: [355, 365] },
  ],
};
const CAT: Mascot = {
  size: [450, 600],
  body: require('../../assets/mascots/cat/body.png'),
  parts: [
    { part: 'tail', image: require('../../assets/mascots/cat/tail.png'), pivot: [168, 290] },
    { part: 'back', image: require('../../assets/mascots/cat/back.png'), pivot: [100, 355] },
    { part: 'front', image: require('../../assets/mascots/cat/front.png'), pivot: [358, 335] },
    { part: 'front2', image: require('../../assets/mascots/cat/front2.png'), pivot: [305, 375] },
  ],
};
const RABBIT: Mascot = {
  size: [400, 600],
  body: require('../../assets/mascots/rabbit/body.png'),
  parts: [
    { part: 'ear', image: require('../../assets/mascots/rabbit/ear.png'), pivot: [226, 200] },
    { part: 'tail', image: require('../../assets/mascots/rabbit/tail.png'), pivot: [150, 300] },
    { part: 'back', image: require('../../assets/mascots/rabbit/back.png'), pivot: [105, 375] },
    { part: 'front', image: require('../../assets/mascots/rabbit/front.png'), pivot: [305, 345] },
  ],
};
const MASCOT: Record<Critter, Mascot> = { dog: DOG, cat: CAT, rabbit: RABBIT, bird: RABBIT };

// One 1.6 s beat drives every part: a quick tail wag, paws paddling in turn, a floppy ear.
const SWING: Record<Part, { input: number[]; deg: number[] }> = {
  tail: { input: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 1], deg: [0, 14, -10, 14, -10, 0, 0] },
  front: { input: [0, 0.25, 0.5, 0.75, 1], deg: [0, -9, 0, 6, 0] },
  front2: { input: [0, 0.25, 0.5, 0.75, 1], deg: [0, 6, 0, -8, 0] },
  back: { input: [0, 0.25, 0.5, 0.75, 1], deg: [0, 7, 0, -7, 0] },
  ear: { input: [0, 0.3, 0.55, 1], deg: [0, -7, 2, 0] },
};

// Happy mascot that stays in place: wags its tail, paddles its paws and breathes a little.
export function WigglingMascot({ animal, width = 120, height = 150 }: { animal: Critter; width?: number; height?: number }) {
  const mascot = MASCOT[animal];
  const [pop] = useState(() => new Animated.Value(0));
  const [beat] = useState(() => new Animated.Value(0));
  const [breath] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }).start();
    const loops = [
      Animated.loop(Animated.timing(beat, { toValue: 1, duration: 1600, easing: Easing.linear, useNativeDriver: true })),
      Animated.loop(
        Animated.sequence([
          Animated.timing(breath, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(breath, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ),
    ];
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [beat, breath, pop]);

  // Fit the source aspect ratio inside the box, so layer pivots (in %) line up with the art.
  const [w, h] = mascot.size;
  const scale = Math.min(width / w, height / h);
  const box = { width: w * scale, height: h * scale };
  const layer = { position: 'absolute' as const, top: 0, left: 0, ...box };

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          box,
          {
            transformOrigin: 'bottom',
            transform: [{ scale: pop }, { scaleY: breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) }],
          },
        ]}
      >
        {mascot.parts
          .filter((p) => p.part === 'back' || p.part === 'tail')
          .map((p) => (
            <MascotPart key={p.part} {...p} beat={beat} size={mascot.size} style={layer} />
          ))}
        <Image source={mascot.body} style={layer} contentFit="contain" />
        {mascot.parts
          .filter((p) => p.part !== 'back' && p.part !== 'tail')
          .map((p) => (
            <MascotPart key={p.part} {...p} beat={beat} size={mascot.size} style={layer} />
          ))}
      </Animated.View>
    </View>
  );
}

function MascotPart({
  part,
  image,
  pivot,
  size,
  beat,
  style,
}: Mascot['parts'][number] & { size: [number, number]; beat: Animated.Value; style: object }) {
  const swing = SWING[part];
  return (
    <Animated.View
      style={[
        style,
        {
          transformOrigin: `${(pivot[0] / size[0]) * 100}% ${(pivot[1] / size[1]) * 100}%`,
          transform: [{ rotate: beat.interpolate({ inputRange: swing.input, outputRange: swing.deg.map((d) => `${d}deg`) }) }],
        },
      ]}
    >
      <Image source={image} style={{ width: '100%', height: '100%' }} contentFit="contain" />
    </Animated.View>
  );
}

function HappyPet({ animal }: { animal: Critter }) {
  return (
    <View style={styles.pet}>
      <WigglingMascot animal={animal} />
    </View>
  );
}
