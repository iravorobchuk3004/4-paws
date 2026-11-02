import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Celebration, critterFor } from '@/components/Celebration';
import { Progress } from '@/components/Progress';
import { PrimaryButton, SecondaryButton } from '@/components/ui';
import { getProfile } from '@/data/profiles';
import { BONES_PER_MEAL, bonesToNextMeal, mealsFrom } from '@/lib/treats';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const GROUND = 72;
const PLAYER = 64;
const PLAYER_X = 28;
const GRAVITY = 2600;
const JUMP = 920;
const SLOTS = 6;
const SIZE = { bone: 34, star: 36, ball: 34, bath: 44 };
const EMOJI = { bone: '🦴', star: '⭐', ball: '🎾', bath: '🛁' };
const SHIELD_S = 6;
// Bones in a row without missing one raise the multiplier.
const comboMultiplier = (combo: number) => (combo >= 12 ? 3 : combo >= 5 ? 2 : 1);

type Kind = keyof typeof SIZE;
type Item = { kind: Kind; x: number; y: number; alive: boolean };
type Phase = 'ready' | 'playing' | 'over';

// Full-screen endless runner: tap anywhere to jump over bath tubs and catch bones.
// Stars are worth 5, a tennis ball gives a few seconds of bath-proof shield,
// and catching bones in a row builds a x2 / x3 combo.
export default function TreatRun() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = getProfile(id);
  const { treats, bestRun, addTreats } = useApp();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const floor = GROUND + insets.bottom;

  const [phase, setPhase] = useState<Phase>('ready');
  const [score, setScore] = useState(0);
  const [kinds, setKinds] = useState<Kind[]>(() => Array(SLOTS).fill('bone'));
  const [newMeal, setNewMeal] = useState(false);
  const [combo, setCombo] = useState(0);
  const [shielded, setShielded] = useState(false);
  const [popText, setPopText] = useState('');

  // Animated positions are driven straight from the game loop, so frames don't re-render React.
  const [playerY] = useState(() => new Animated.Value(0));
  const [spin] = useState(() => new Animated.Value(0));
  const [groundX] = useState(() => new Animated.Value(0));
  const [pop] = useState(() => new Animated.Value(1));
  const [slots] = useState(() =>
    Array.from({ length: SLOTS }, () => ({ pos: new Animated.ValueXY({ x: -100, y: 0 }), opacity: new Animated.Value(0) })),
  );
  const game = useRef({
    y: 0, vy: 0, jumps: 0, speed: 260, dist: 0, spawnIn: 0.8, score: 0, combo: 0, shield: 0, items: [] as Item[],
  });

  const start = () => {
    const g = game.current;
    Object.assign(g, { y: 0, vy: 0, jumps: 0, speed: 260, dist: 0, spawnIn: 0.8, score: 0, combo: 0, shield: 0 });
    g.items = Array.from({ length: SLOTS }, () => ({ kind: 'bone' as Kind, x: -100, y: 0, alive: false }));
    slots.forEach((s) => s.opacity.setValue(0));
    setScore(0);
    setCombo(0);
    setShielded(false);
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

    // "+2" style popup above the pet.
    const flash = (text: string) => {
      setPopText(text);
      pop.setValue(0);
      Animated.timing(pop, { toValue: 1, duration: 650, useNativeDriver: true }).start();
    };

    const tick = () => {
      const now = Date.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (g.shield > 0) {
        g.shield -= dt;
        if (g.shield <= 0) setShielded(false);
      }

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
          const r = Math.random();
          const kind: Kind = r < 0.36 ? 'bath' : r < 0.42 ? 'ball' : r < 0.5 ? 'star' : 'bone';
          const y = kind === 'bath' ? 0 : kind === 'star' ? 150 + Math.random() * 110 : 20 + Math.random() * 210;
          g.items[free] = { kind, x: width + 20, y, alive: true };
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
          // A missed bone breaks the combo.
          if (it.kind === 'bone' && g.combo) {
            g.combo = 0;
            setCombo(0);
          }
          continue;
        }
        slots[i].pos.setValue({ x: it.x, y: -it.y });
        const m = it.kind === 'bath' ? 12 : 4;
        const hit =
          PLAYER_X + m < it.x + size && PLAYER_X + PLAYER - m > it.x && g.y + m < it.y + size && g.y + PLAYER - m > it.y;
        if (!hit) continue;
        it.alive = false;
        slots[i].opacity.setValue(0);
        if (it.kind === 'bath') {
          if (g.shield <= 0) return end();
          // The ball's shield splashes through one bath tub.
          g.shield = 0;
          setShielded(false);
          flash('💦 Splash!');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
          continue;
        }
        if (it.kind === 'ball') {
          g.shield = SHIELD_S;
          setShielded(true);
          flash('🎾 Shield!');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          continue;
        }
        g.combo += 1;
        const points = (it.kind === 'star' ? 5 : 1) * comboMultiplier(g.combo);
        g.score += points;
        setScore(g.score);
        setCombo(g.combo);
        flash(`+${points}`);
        Haptics.impactAsync(it.kind === 'star' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, width, slots, playerY, groundX, spin, pop, addTreats, treats]);

  const total = phase === 'over' ? treats : treats + score;
  const meals = mealsFrom(total);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Pressable onPressIn={jump} style={StyleSheet.absoluteFill} accessibilityLabel="Jump">
        <Text style={[styles.cloud, { left: 30, top: insets.top + 110 }]}>☁️</Text>
        <Text style={[styles.cloud, { right: 50, top: insets.top + 190 }]}>☁️</Text>
        <Text style={[styles.cloud, { left: width * 0.45, top: insets.top + 290, fontSize: 22 }]}>☁️</Text>

        {slots.map((s, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.item,
              { bottom: floor, fontSize: SIZE[kinds[i]] - 4, opacity: s.opacity, transform: s.pos.getTranslateTransform() },
            ]}
          >
            {EMOJI[kinds[i]]}
          </Animated.Text>
        ))}

        <Animated.View
          style={[
            styles.player,
            {
              bottom: floor,
              transform: [
                { translateY: playerY },
                { rotate: spin.interpolate({ inputRange: [0, 2], outputRange: ['0deg', '-720deg'] }) },
              ],
            },
          ]}
        >
          <Image source={pet.thumb} style={styles.fill} contentFit="cover" />
        </Animated.View>
        {shielded && (
          <Animated.View
            pointerEvents="none"
            style={[styles.shield, { bottom: floor - 8, transform: [{ translateY: playerY }] }]}
          />
        )}
        <Animated.Text
          pointerEvents="none"
          style={[
            styles.pop,
            {
              bottom: floor + PLAYER + 8,
              opacity: pop.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
              transform: [{ translateY: Animated.add(playerY, pop.interpolate({ inputRange: [0, 1], outputRange: [0, -36] })) }],
            },
          ]}
        >
          {popText}
        </Animated.Text>

        <View style={[styles.ground, { height: floor }]}>
          <Animated.View style={[styles.dashes, { transform: [{ translateX: groundX }] }]}>
            {Array.from({ length: Math.ceil(width / 48) + 2 }, (_, i) => (
              <View key={i} style={styles.dash} />
            ))}
          </Animated.View>
        </View>

        {phase === 'ready' && (
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>Run with {pet.name}!</Text>
            <Text style={styles.overlayText}>Tap anywhere to jump · tap twice for a double jump</Text>
            <Text style={styles.overlayText}>Catch 🦴 · dodge the bath 🛁</Text>
            <Text style={styles.overlayText}>⭐ = 5 bones · 🎾 = splash through one bath</Text>
            <Text style={styles.overlayText}>Bones in a row = x2, then x3 🔥</Text>
            <Text style={styles.tapHint}>Tap to start</Text>
          </View>
        )}
      </Pressable>

      {/* HUD sits above the tap area; only the back button takes touches. */}
      <View style={[styles.hud, { top: insets.top + 8 }]} pointerEvents="box-none">
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={10} accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={22} color={colors.black} />
        </Pressable>
        <View style={styles.scoreWrap} pointerEvents="none">
          <Text style={styles.score}>🦴 {score}</Text>
          {comboMultiplier(combo) > 1 ? (
            <Text style={styles.combo}>x{comboMultiplier(combo)} combo 🔥</Text>
          ) : (
            <Text style={styles.best}>Best {Math.max(bestRun, phase === 'over' ? 0 : score)}</Text>
          )}
        </View>
        <View style={styles.meals} pointerEvents="none">
          <Text style={styles.mealsText}>🍲 {meals}</Text>
        </View>
      </View>
      <View style={[styles.jar, { top: insets.top + 64 }]} pointerEvents="none">
        <Progress value={(total % BONES_PER_MEAL) / BONES_PER_MEAL} />
        <Text style={styles.jarMeta}>{bonesToNextMeal(total)} 🦴 to the next real meal</Text>
      </View>

      {phase === 'over' && (
        <View style={styles.result}>
          {newMeal && <Celebration animal={critterFor(pet.kind, pet.categories)} />}
          <Text style={styles.resultTitle}>{newMeal ? 'You unlocked a meal!' : `${score} bones!`}</Text>
          <Text style={styles.resultText}>
            {score >= bestRun && score > 0 ? 'New best run 🎉' : `Best run: ${bestRun}`}
          </Text>
          <Text style={styles.resultMeta}>Every {BONES_PER_MEAL} bones = one real meal for a shelter pet.</Text>
          <View style={styles.resultButtons}>
            <PrimaryButton title="Play again" onPress={start} />
            <SecondaryButton title="Done" onPress={() => router.back()} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.purpleTint },
  shield: {
    position: 'absolute',
    left: PLAYER_X - 8,
    width: PLAYER + 16,
    height: PLAYER + 16,
    borderRadius: (PLAYER + 16) / 2,
    borderWidth: 4,
    borderColor: colors.lime,
    backgroundColor: 'rgba(220,250,157,0.25)',
  },
  pop: { position: 'absolute', left: PLAYER_X - 20, width: PLAYER + 40, textAlign: 'center', fontFamily: fonts.extraBold, fontSize: 20, color: colors.purple },
  combo: { fontFamily: fonts.bold, fontSize: 12, color: colors.purple },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  hud: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreWrap: { flex: 1, alignItems: 'center' },
  score: { fontFamily: fonts.extraBold, fontSize: 28, lineHeight: 34, color: colors.black },
  best: { fontFamily: fonts.medium, fontSize: 12, color: colors.grey },
  meals: { minWidth: 44, height: 44, paddingHorizontal: 12, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  mealsText: { fontFamily: fonts.bold, fontSize: 15, color: colors.black },
  jar: { position: 'absolute', left: 72, right: 72, gap: 4, alignItems: 'center' },
  jarMeta: { fontFamily: fonts.medium, fontSize: 11, color: colors.purple },
  cloud: { position: 'absolute', fontSize: 30, opacity: 0.8 },
  item: { position: 'absolute', left: 0 },
  player: {
    position: 'absolute',
    left: PLAYER_X,
    width: PLAYER,
    height: PLAYER,
    borderRadius: PLAYER / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: colors.greyBg,
  },
  ground: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.lime, overflow: 'hidden' },
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
  overlayTitle: { fontFamily: fonts.extraBold, fontSize: 28, color: colors.black },
  overlayText: { fontFamily: fonts.regular, fontSize: 15, color: colors.grey, textAlign: 'center' },
  tapHint: { fontFamily: fonts.bold, fontSize: 17, color: colors.purple, marginTop: 12 },
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
  resultMeta: { fontFamily: fonts.regular, fontSize: 13, color: colors.grey, textAlign: 'center' },
  resultButtons: { alignSelf: 'stretch', gap: 8, marginTop: 24 },
});
