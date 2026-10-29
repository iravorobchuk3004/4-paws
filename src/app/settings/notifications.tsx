import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavHeader, PageHeading } from '@/components/ui';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

export default function NotificationSettings() {
  const { notifications, setNotifications } = useApp();

  const rows = [
    {
      key: 'meetings' as const,
      title: 'Meeting updates',
      text: 'When a shelter replies or confirms a date',
    },
    {
      key: 'news' as const,
      title: 'Shelter news',
      text: 'New animals and urgent care needs near you',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Profile" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <PageHeading title="Notifications" subtitle="Choose what we can tell you about." />
        <View style={styles.card}>
          {rows.map((row, i) => (
            <View key={row.key} style={[styles.row, i > 0 && styles.divider]}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.title}>{row.title}</Text>
                <Text style={styles.text}>{row.text}</Text>
              </View>
              <Switch
                value={notifications[row.key]}
                onValueChange={(v) => setNotifications({ [row.key]: v })}
                trackColor={{ true: colors.purple, false: colors.greyOption }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  card: { marginHorizontal: 16, marginTop: 24, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  divider: { borderTopWidth: 1, borderTopColor: colors.greyBg },
  title: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.black },
  text: { fontFamily: fonts.regular, fontSize: 12, color: colors.grey },
});
