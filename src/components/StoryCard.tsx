import { Ionicons } from '@expo/vector-icons';
import { Image, ImageProps } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

export type StoryCardData = {
  photo: ImageProps['source'];
  quote: string;
  names: string;
  meta: string;
  avatar?: ImageProps['source'];
  initials?: string;
  mine?: boolean;
};

// "Happy tails" card: the pet at home, the adopter's words and who they are.
export function StoryCard({ story, onShare }: { story: StoryCardData; onShare?: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.photo}>
        <Image source={story.photo} style={StyleSheet.absoluteFill} contentFit="cover" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{story.mine ? '✨ Your story' : '🏡 Home now'}</Text>
        </View>
        {onShare && (
          <Pressable style={styles.share} onPress={onShare} hitSlop={8} accessibilityLabel="Share story">
            <Ionicons name="share-outline" size={18} color={colors.black} />
          </Pressable>
        )}
      </View>
      <Text style={styles.quote} numberOfLines={3}>
        “{story.quote}”
      </Text>
      <View style={styles.footer}>
        {story.avatar ? (
          <Image source={story.avatar} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.initials]}>
            <Text style={styles.initialsText}>{story.initials ?? '🐾'}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.names} numberOfLines={1}>
            {story.names}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {story.meta}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 260, padding: 8, gap: 10, borderRadius: 20, backgroundColor: colors.white },
  photo: { height: 170, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.greyBg },
  badge: {
    position: 'absolute',
    left: 8,
    top: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: colors.lime,
  },
  badgeText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.black },
  share: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quote: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 19, color: colors.black, paddingHorizontal: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4, paddingBottom: 4 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  initials: { backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontFamily: fonts.bold, fontSize: 12, color: colors.black },
  names: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.black },
  meta: { fontFamily: fonts.regular, fontSize: 11, color: colors.greyMuted },
});
