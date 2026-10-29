import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Celebration, critterFor } from '@/components/Celebration';
import { Progress } from '@/components/Progress';
import { NavHeader, PrimaryButton, SecondaryButton } from '@/components/ui';
import { getProfile } from '@/data/profiles';
import { BONES_PER_MEAL, bonesToNextMeal, mealsFrom } from '@/lib/treats';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const FIELD_HEIGHT = 320;
const GROUND = 56;
const PLAYER = 64;
const PLAYER_X = 28;
const GRAVITY = 2600;
const JUMP = 920;
const SLOTS = 6;
const SIZE = { bone: 34, bath: 44 };

type Kind = keyof typeof SIZE;
type Item = { kind: Kind; x: number; y: number; alive: boolean };
type Phase = 'ready' | 'playing' | 'over';

// Endless runner: the pet runs, you tap to jump over bath tubs and catch bones.
export default function TreatRun() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = getProfile(id);
  const { treats, bestRun, addTreats } = useApp();
  const { width: screen } = useWindowDimensions();
  const width = screen - 32;

  const [phase, setPhase] = useState<Phase>('ready');
  const [score, setScore] = useState(0);
  const [kinds, setKinds] = useState<Kind[]>(() => Array(SLOTS).fill('bone'));
  const [newMeal, setNewMeal] = useState(false);

  // Animated positions are driven straight from the game loop, so frames don't re-render React.
  const [playerY] = useState(() => new Animated.Value(0));
  const [spin] = useState(() => new Animated.Value(0));
  const [groundX] = useState(() => new Animated.Value(0));
  const [slots] = useState(() =>
    Array.from({ length: SLOTS }, () => ({ pos: new Animated.ValueXY({ x: -100, y: 0 }), opacity: new Animated.Value(0) })),
  );
  const game = useRef({ y: 0, vy: 0, jumps: 0, speed: 260, dist: 0, spawnIn: 0.8, score: 0, items: [] as Item[] });

  const start = () => {
    const g = game.current;
    Object.assign(g, { y: 0, vy: 0, jumps: 0, speed: 260, dist: 0, spawnIn: 0.8, score: 0 });
    g.items = Array.from({ length: SLOTS }, () => ({ kind: 'bone' as Kind, x: -100, y: 0, alive: false }));
    slots.forEach((s) => s.opacity.setValue(0));
    setScore(0);
    setNewMeal(false);
    setPhase('playing');
  };

  const jump = () => {
    if (phase !== 'playing') return start();
    const g = game.current;
    if (g.jumps >= 2) return;
    g.vy = g.jumps === 0 ? JUMP : JUMP * 0.85;
    g.jumps += 1;
    Animated.timing(spin, { toValue: g.jumps, duration: 350, useNativeDriver: true }).start();
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const g = game.current;
    let frame = 0;
    let last = Date.now();

    const end = () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setNewMeal(mealsFrom(treats + g.score) > mealsFrom(treats));
      addTreats(g.score);
      setPhase('over');
    };

    const tick = () => {
      const now = Date.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Pet physics.
      g.vy -= GRAVITY * dt;
      g.y = Math.max(0, g.y + g.vy * dt);
      if (g.y === 0) {
        g.vy = 0;
        if (g.jumps) {
          g.jumps = 0;
          spin.setValue(0);
        }
      }
      playerY.setValue(-g.y);

      // World scrolls faster over time.
      g.speed = Math.min(620, g.speed + 14 * dt);
      g.dist += g.speed * dt;
      groundX.setValue(-(g.dist % 48));

      // Spawn a bone or a bath tub into a free slot.
      g.spawnIn -= dt;
      if (g.spawnIn <= 0) {
        const free = g.items.findIndex((it) => !it.alive);
        if (free >= 0) {
          const kind: Kind = Math.random() < 0.38 ? 'bath' : 'bone';
          g.items[free] = { kind, x: width + 20, y: kind === 'bath' ? 0 : 20 + Math.random() * 150, alive: true };
          slots[free].opacity.setValue(1);
          setKinds((k) => (k[free] === kind ? k : k.map((v, i) => (i === free ? kind : v))));
        }
        g.spawnIn = (0.55 + Math.random() * 0.7) * (300 / g.speed) * 1.6;
      }

      // Move items and check hits (with a little forgiveness around the edges).
      for (let i = 0; i < SLOTS; i++) {
        const it = g.items[i];
        if (!it.alive) continue;
        it.x -= g.speed * dt;
        const size = SIZE[it.kind];
        if (it.x < -size) {
          it.alive = false;
          slots[i].opacity.setValue(0);
          continue;
        }
        slots[i].pos.setValue({ x: it.x, y: -it.y });
        const m = it.kind === 'bath' ? 12 : 4;
        const hit =
          PLAYER_X + m < it.x + size && PLAYER_X + PLAYER - m > it.x && g.y + m < it.y + size && g.y + PLAYER - m > it.y;
        if (!hit) continue;
        if (it.kind === 'bath') return end();
        it.alive = false;
        slots[i].opacity.setValue(0);
        g.score += 1;
        setScore(g.score);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, width, slots, playerY, groundX, spin, addTreats, treats]);

  const total = phase === 'over' ? treats : treats + score;
  const meals = mealsFrom(total);

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Treat Run" />
      <View style={styles.body}>
        <View style={styles.hud}>
          <Text style={styles.score}>🦴 {score}</Text>
          <Text style={styles.best}>Best {Math.max(bestRun, phase === 'over' ? 0 : score)}</Text>
        </View>

        <Pressable onPressIn={jump} style={[styles.field, { width }]}>
          <Text style={[styles.cloud, { left: 30, top: 30 }]}>☁️</Text>
          <Text style={[styles.cloud, { right: 40, top: 70 }]}>☁️</Text>

          {slots.map((s, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.item,
                { fontSize: SIZE[kinds[i]] - 4, opacity: s.opacity, transform: s.pos.getTranslateTransform() },
              ]}
            >
              {kinds[i] === 'bath' ? '🛁' : '🦴'}
            </Animated.Text>
          ))}

          <Animated.View
            style={[
              styles.player,
              {
                transform: [
                  { translateY: playerY },
                  { rotate: spin.interpolate({ inputRange: [0, 2], outputRange: ['0deg', '-720deg'] }) },
                ],
              },
            ]}
          >
            <Image source={pet.thumb} style={StyleSheet.absoluteFill} contentFit="cover" />
          </Animated.View>

          <View style={styles.ground}>
            <Animated.View style={[styles.dashes, { transform: [{ translateX: groundX }] }]}>
              {Array.from({ length: Math.ceil(width / 48) + 2 }, (_, i) => (
                <View key={i} style={styles.dash} />
              ))}
            </Animated.View>
          </View>

          {phase === 'ready' && (
            <View style={styles.overlay}>
              <Text style={styles.overlayTitle}>Run with {pet.name}!</Text>
              <Text style={styles.overlayText}>Tap to jump · tap twice for a double jump</Text>
              <Text style={styles.overlayText}>Catch 🦴 · dodge the bath 🛁</Text>
              <Text style={styles.tapHint}>Tap to start</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.jar}>
          <View style={styles.jarRow}>
            <Text style={styles.jarTitle}>🍲 Meals unlocked: {meals}</Text>
            <Text style={styles.jarMeta}>{bonesToNextMeal(total)} 🦴 to the next</Text>
          </View>
          <Progress value={(total % BONES_PER_MEAL) / BONES_PER_MEAL} />
          <Text style={styles.jarText}>Every {BONES_PER_MEAL} bones = one real meal for a shelter pet.</Text>
        </View>
      </View>

      {phase === 'over' && (
        <View style={styles.result}>
          {newMeal && <Celebration animal={critterFor(pet.kind, pet.categories)} />}
          <Text style={styles.resultTitle}>{newMeal ? 'You unlocked a meal!' : `${score} bones!`}</Text>
          <Text style={styles.resultText}>
            {score >= bestRun && score > 0 ? 'New best run 🎉' : `Best run: ${bestRun}`}
          </Text>
          <View style={styles.resultButtons}>
            <PrimaryButton title="Play again" onPress={start} />
            <SecondaryButton title="Done" onPress={() => router.back()} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { flex: 1, paddingHorizontal: 16, gap: 16, paddingTop: 8 },
  hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  score: { fontFamily: fonts.extraBold, fontSize: 28, color: colors.black },
  best: { fontFamily: fonts.medium, fontSize: 14, color: colors.grey },
  field: {
    height: FIELD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.purpleTint,
  },
  cloud: { position: 'absolute', fontSize: 28, opacity: 0.8 },
  item: { position: 'absolute', left: 0, bottom: GROUND },
  player: {
    position: 'absolute',
    left: PLAYER_X,
    bottom: GROUND,
    width: PLAYER,
    height: PLAYER,
    borderRadius: PLAYER / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: colors.greyBg,
  },
  ground: { position: 'absolute', left: 0, right: 0, bottom: 0, height: GROUND, backgroundColor: '#DCFA9D', overflow: 'hidden' },
  dashes: { flexDirection: 'row', gap: 24, paddingTop: 14 },
  dash: { width: 24, height: 6, borderRadius: 3, backgroundColor: 'rgba(98,82,206,0.18)' },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(250,248,243,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 24,
  },
  overlayTitle: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.black },
  overlayText: { fontFamily: fonts.regular, fontSize: 14, color: colors.grey, textAlign: 'center' },
  tapHint: { fontFamily: fonts.bold, fontSize: 16, color: colors.purple, marginTop: 12 },
  jar: { padding: 16, gap: 10, borderRadius: 20, backgroundColor: colors.white },
  jarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jarTitle: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.black },
  jarMeta: { fontFamily: fonts.medium, fontSize: 12, color: colors.purple },
  jarText: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
  result: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(250,248,243,0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  resultTitle: { fontFamily: fonts.extraBold, fontSize: 28, color: colors.black, textAlign: 'center' },
  resultText: { fontFamily: fonts.medium, fontSize: 16, color: colors.grey },
  resultButtons: { alignSelf: 'stretch', gap: 8, marginTop: 24 },
});
