import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

const SIZE = 52;
const LIFE_MS = 1500;

type Treat = { id: number; x: number; y: number; gold: boolean };

// A tiny "while you wait" game: bones pop up around the box, tap them before they vanish.
// Golden stars are rare and worth five.
export function TreatCatch({
  running = true,
  height = 180,
  onCatch,
}: {
  running?: boolean;
  height?: number;
  onCatch: (points: number) => void;
}) {
  const [treats, setTreats] = useState<Treat[]>([]);
  const [width, setWidth] = useState(0);
  const nextId = useRef(0);

  useEffect(() => {
    if (!running || !width) return;
    const spawn = () => {
      const id = nextId.current++;
      setTreats((list) => [
        ...list,
        {
          id,
          x: 8 + Math.random() * (width - SIZE - 16),
          y: 8 + Math.random() * (height - SIZE - 16),
          gold: Math.random() < 0.12,
        },
      ]);
    };
    spawn();
    const timer = setInterval(spawn, 650);
    return () => clearInterval(timer);
  }, [running, width, height]);

  const remove = (id: number) => setTreats((list) => list.filter((t) => t.id !== id));

  return (
    <View style={[styles.box, { height }]} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
      {treats.map((t) => (
        <TreatSprite
          key={t.id}
          treat={t}
          onGone={() => remove(t.id)}
          onTap={() => {
            Haptics.impactAsync(t.gold ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            onCatch(t.gold ? 5 : 1);
          }}
        />
      ))}
    </View>
  );
}

function TreatSprite({ treat, onTap, onGone }: { treat: Treat; onTap: () => void; onGone: () => void }) {
  const [life] = useState(() => new Animated.Value(0));
  const [pop] = useState(() => new Animated.Value(0));
  const [caught, setCaught] = useState(false);

  useEffect(() => {
    const anim = Animated.timing(life, { toValue: 1, duration: LIFE_MS, easing: Easing.linear, useNativeDriver: true });
    anim.start(({ finished }) => finished && onGone());
    return () => anim.stop();
    // onGone is stable enough for a sprite that lives 1.5 s.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [life]);

  const tap = () => {
    if (caught) return;
    setCaught(true);
    onTap();
    life.stopAnimation();
    Animated.timing(pop, { toValue: 1, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(onGone);
  };

  return (
    <Pressable onPressIn={tap} style={[styles.treat, { left: treat.x, top: treat.y }]} hitSlop={8}>
      <Animated.View
        style={{
          opacity: caught
            ? pop.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
            : life.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 1, 1, 0] }),
          transform: [
            {
              scale: caught
                ? pop.interpolate({ inputRange: [0, 1], outputRange: [1.2, 1.6] })
                : life.interpolate({ inputRange: [0, 0.12, 0.2, 1], outputRange: [0.3, 1.15, 1, 0.9] }),
            },
            { translateY: caught ? pop.interpolate({ inputRange: [0, 1], outputRange: [0, -24] }) : 0 },
          ],
        }}
      >
        <Text style={styles.emoji}>{caught ? (treat.gold ? '+5' : '+1') : treat.gold ? '⭐' : '🦴'}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: 24, backgroundColor: colors.purpleTint, overflow: 'hidden' },
  treat: { position: 'absolute', width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontFamily: fonts.extraBold, fontSize: 32, lineHeight: 40, color: colors.purple },
});
