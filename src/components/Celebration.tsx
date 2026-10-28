import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const confetti = require('../../assets/figma/confetti-cluster.svg');

// Jumping dog with confetti, used on success screens.
export function Celebration() {
  return (
    <View style={styles.illustration}>
      <Image source={confetti} style={[styles.cluster, { left: 185, top: -23 }]} />
      <Image source={confetti} style={[styles.cluster, { left: 12, top: 74 }]} />
      <Image source={confetti} style={[styles.cluster, { left: 190, top: 90, transform: [{ rotate: '120deg' }] }]} />
      <Image source={confetti} style={[styles.cluster, { left: 30, top: -10, transform: [{ rotate: '-160deg' }] }]} />
      <Image source={require('../../assets/figma/sent-dog.png')} style={styles.dog} contentFit="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  illustration: { width: 333, height: 215, alignSelf: 'center' },
  cluster: { position: 'absolute', width: 123, height: 124 },
  dog: { position: 'absolute', left: 110, top: 36, width: 113, height: 141 },
});
