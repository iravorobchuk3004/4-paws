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

// Jumping dog with a confetti burst, used on success screens.
export function Celebration() {
  const [pieces] = useState(makePieces);
  const burst = useState(() => pieces.map(() => new Animated.Value(0)))[0];
  const clusterIn = useState(() => clusters.map(() => new Animated.Value(0)))[0];
  const dogScale = useState(() => new Animated.Value(0.3))[0];
  const dogFloat = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    Animated.spring(dogScale, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();

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

    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(dogFloat, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(dogFloat, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    float.start();
    return () => float.stop();
  }, [burst, clusterIn, dogFloat, dogScale, pieces]);

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

      <Animated.View
        style={[
          styles.dog,
          {
            transform: [
              { translateY: dogFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
              { scale: dogScale },
            ],
          },
        ]}
      >
        <Image source={require('../../assets/figma/sent-dog.png')} style={StyleSheet.absoluteFill} contentFit="cover" />
      </Animated.View>

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
  dog: { position: 'absolute', left: 110, top: 36, width: 113, height: 141 },
  piece: { position: 'absolute', left: 166, top: 100 },
});
