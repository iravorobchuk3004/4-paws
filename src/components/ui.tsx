import { Image, ImageProps } from 'expo-image';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { PressableScale } from '@/components/anim';
import { colors, fonts, shadow } from '@/theme';

export function Icon({ source, size = 24, tint }: { source: ImageProps['source']; size?: number; tint?: string }) {
  return <Image source={source} style={{ width: size, height: size }} tintColor={tint} contentFit="contain" />;
}

export function PrimaryButton({
  title,
  onPress,
  icon,
  style,
}: {
  title: string;
  onPress?: () => void;
  icon?: ImageProps['source'];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <PressableScale onPress={onPress} style={[styles.primary, style]}>
      <Text style={styles.primaryText}>{title}</Text>
      {icon && <Icon source={icon} size={18} />}
    </PressableScale>
  );
}

export function SecondaryButton({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <PressableScale onPress={onPress} style={styles.secondary}>
      <Text style={styles.secondaryText}>{title}</Text>
    </PressableScale>
  );
}

// Back link on the left, step/title on the right (or centered when there is no back link).
export function NavHeader({
  step,
  location,
  back = true,
}: {
  step?: string;
  location?: string;
  back?: boolean;
}) {
  return (
    <View style={[styles.navHeader, !back && { justifyContent: 'center' }]}>
      {back && (
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          style={styles.back}
          hitSlop={12}
        >
          <Icon source={require('../../assets/figma/chevron-left.svg')} />
          <Text style={styles.navText}>Back</Text>
        </Pressable>
      )}
      {step && <Text style={styles.navText}>{step}</Text>}
      {location && <Text style={styles.navLocation}>{location}</Text>}
    </View>
  );
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {subtitle && <Text style={styles.headingSubtitle}>{subtitle}</Text>}
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  icon,
  variant = 'grey',
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ImageProps['source'];
  variant?: 'grey' | 'outline';
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.9}
      style={[
        styles.chip,
        variant === 'outline' && styles.chipOutline,
        selected && styles.chipSelected,
      ]}
    >
      {icon && <Icon source={icon} />}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </PressableScale>
  );
}

export function FormField({
  label,
  icon,
  hint,
  error,
  trailing,
  ...input
}: TextInputProps & {
  label: string;
  icon: ImageProps['source'];
  hint?: string;
  error?: string | false;
  trailing?: ReactNode;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.input, !!error && { borderColor: colors.error }]}>
        <Icon source={icon} />
        <TextInput
          placeholderTextColor="rgba(98,97,95,0.43)"
          style={styles.inputText}
          {...input}
        />
        {trailing}
      </View>
      {error ? (
        <Text style={[styles.hint, { color: colors.error }]}>{error}</Text>
      ) : (
        hint && <Text style={styles.hint}>{hint}</Text>
      )}
    </View>
  );
}

export function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} hitSlop={8}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  primary: {
    height: 56,
    borderRadius: 270,
    backgroundColor: colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'stretch',
    ...shadow.button,
  },
  primaryText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  secondary: {
    height: 56,
    borderRadius: 150,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  secondaryText: { fontFamily: fonts.bold, fontSize: 15, color: colors.black },
  navHeader: {
    height: 42,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  navText: { fontFamily: fonts.semiBold, fontSize: 18, lineHeight: 25, color: colors.black },
  navLocation: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22, color: colors.purple },
  heading: { alignItems: 'center', gap: 8, paddingHorizontal: 32, marginTop: 20 },
  headingTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    lineHeight: 34,
    color: colors.black,
    textAlign: 'center',
  },
  headingSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    color: colors.grey,
    textAlign: 'center',
  },
  chip: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 140,
    backgroundColor: colors.greyOption,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  chipOutline: {
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.grey1,
  },
  chipSelected: { backgroundColor: colors.purpleSelected, borderWidth: 1, borderColor: colors.purple },
  chipText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.black },
  chipTextSelected: { fontFamily: fonts.medium, color: colors.purple },
  fieldLabel: { fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 20, color: colors.black },
  input: {
    height: 56,
    borderRadius: 60,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputText: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.black },
  hint: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.grey },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  seeAll: { fontFamily: fonts.medium, fontSize: 13, color: colors.purple },
});
