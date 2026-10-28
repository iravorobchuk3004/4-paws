import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { Chip } from '@/components/ui';
import { colors, fonts } from '@/theme';

// Single- or multi-select chip group with a label, used by the report forms.
export function ChoiceField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | string[];
  onChange: (option: string) => void;
}) {
  const selected = Array.isArray(value) ? value : [value];
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map((o) => (
          <Chip key={o} label={o} selected={selected.includes(o)} onPress={() => onChange(o)} />
        ))}
      </View>
    </View>
  );
}

export function TextArea({ label, ...input }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        multiline
        textAlignVertical="top"
        placeholderTextColor="rgba(98,97,95,0.6)"
        style={styles.textarea}
        {...input}
      />
    </View>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.black },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  textarea: {
    height: 104,
    padding: 16,
    paddingTop: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    backgroundColor: colors.white,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.black,
  },
  title: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.black },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22, color: colors.grey },
});
