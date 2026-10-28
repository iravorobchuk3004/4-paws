import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceField, PageTitle, TextArea } from '@/components/form';
import { FormField, NavHeader, PrimaryButton } from '@/components/ui';
import { useFoundReport } from '@/components/FoundReport';
import { colors, fonts } from '@/theme';

const user = require('../../../assets/figma/field-user.svg');

export default function FoundAssistance() {
  const { report, update } = useFoundReport();
  const valid = report.help.length > 0 && report.name.trim() && report.phone.trim();

  const toggleHelp = (option: string) =>
    update({
      help: report.help.includes(option)
        ? report.help.filter((h) => h !== option)
        : [...report.help, option],
    });

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader step="Step 3/3" />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <PageTitle
          title="Ask for assistance"
          subtitle="We share your request with shelters and volunteers nearby."
        />

        <View style={{ gap: 20 }}>
          <ChoiceField
            label="What help is needed?"
            options={['Shelter place', 'Foster care', 'Transport', 'Vet check']}
            value={report.help}
            onChange={toggleHelp}
          />
          <ChoiceField
            label="Can you keep the animal safely?"
            options={['For 24 hours', 'No', 'Not sure']}
            value={report.canKeep}
            onChange={(canKeep) => update({ canKeep })}
          />
        </View>

        <TextArea
          label="Current situation"
          placeholder="Still at the found location. Needs transport to a shelter."
          value={report.situation}
          onChangeText={(situation) => update({ situation })}
        />

        <View style={{ gap: 12 }}>
          <Text style={styles.sectionTitle}>Your contact</Text>
          <FormField
            label="Your name"
            placeholder="Anna Kovalenko"
            icon={user}
            autoComplete="name"
            value={report.name}
            onChangeText={(name) => update({ name })}
          />
          <FormField
            label="Phone"
            placeholder="+49 160 000 00 00"
            icon={user}
            keyboardType="phone-pad"
            autoComplete="tel"
            value={report.phone}
            onChangeText={(phone) => update({ phone })}
          />
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title="Submit assistance request"
          onPress={valid ? () => router.replace('/found/thanks') : undefined}
          style={!valid && { opacity: 0.5 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, gap: 24 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
