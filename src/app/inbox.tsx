import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ComponentProps, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInUp } from '@/components/anim';
import { NavHeader, SecondaryButton } from '@/components/ui';
import { useInbox } from '@/lib/inbox';
import { formatDate, useApp } from '@/store';
import { colors, fonts } from '@/theme';

export default function Inbox() {
  const { items, readAt } = useInbox();
  const { markInboxRead } = useApp();
  // Remember what was unread when the screen opened, so the dots stay visible while reading.
  const [seenBefore] = useState(readAt);

  useEffect(() => {
    markInboxRead();
    // Only on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Notifications" />
      <ScrollView contentContainerStyle={styles.body}>
        {items.map((item, i) => (
          <FadeInUp key={item.key} delay={i * 50}>
            <Pressable style={styles.item} onPress={() => router.push(item.href)}>
              <View style={styles.icon}>
                <Ionicons name={item.icon as ComponentProps<typeof Ionicons>['name']} size={20} color={colors.purple} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
                <Text style={styles.time}>{formatDate(item.at)}</Text>
              </View>
              {item.at > seenBefore && <View style={styles.dot} />}
            </Pressable>
          </FadeInUp>
        ))}
        {!items.length && (
          <View style={styles.empty}>
            <Ionicons name="notifications-outline" size={44} color={colors.purpleSelected} />
            <Text style={styles.emptyTitle}>You’re all caught up</Text>
            <Text style={styles.emptyText}>
              Shelter replies, case updates and donation receipts will appear here.
            </Text>
            <SecondaryButton title="Notification settings" onPress={() => router.push('/settings/notifications')} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 12 },
  item: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 20, backgroundColor: colors.white },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purpleTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  text: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.grey },
  time: { fontFamily: fonts.medium, fontSize: 11, color: colors.grey1, marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.purple, marginTop: 4 },
  empty: { alignItems: 'center', gap: 12, paddingTop: 80, paddingHorizontal: 16 },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  emptyText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.grey, textAlign: 'center' },
});
