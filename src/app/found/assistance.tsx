import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceField, PageTitle, TextArea } from '@/components/form';
import { FormField, NavHeader, PrimaryButton } from '@/components/ui';
import { useFoundReport } from '@/components/FoundReport';
import { useApp } from '@/store';
import { colors, fonts } from '@/theme';

const user = require('../../../assets/figma/field-user.svg');

export default function FoundAssistance() {
  const { report, update } = useFoundReport();
  const { addReport } = useApp();
  const { name, phone } = report;
  const [submitted, setSubmitted] = useState(false);
  const nameError = submitted && !name.trim() && 'Add your name so volunteers know who to ask for.';
  const phoneError = submitted && phone.trim().length < 6 && 'Add a phone number volunteers can call.';
  const helpError = submitted && !report.help.length;

  const submit = () => {
    setSubmitted(true);
    if (!name.trim() || phone.trim().length < 6 || !report.help.length) return;
    const id = `FP-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    addReport({
      id,
      animal: report.animal,
      location: report.location.trim(),
      photo: report.photos[0],
      help: report.help,
    });
    update({ submitted: true });
    router.replace({ pathname: '/found/thanks', params: { id } });
  };

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
          {helpError && <Text style={styles.error}>Choose at least one kind of help.</Text>}
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
            value={name}
            onChangeText={(name) => update({ name })}
            error={nameError}
          />
          <FormField
            label="Phone"
            placeholder="+49 160 000 00 00"
            icon={user}
            keyboardType="phone-pad"
            autoComplete="tel"
            value={phone}
            onChangeText={(phone) => update({ phone })}
            error={phoneError}
          />
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton
          title="Submit assistance request"
          onPress={submit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, gap: 24 },
  error: { fontFamily: fonts.medium, fontSize: 12, color: colors.error, marginTop: -12 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  bottom: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
