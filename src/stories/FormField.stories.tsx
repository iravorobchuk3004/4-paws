import type { Meta, StoryObj } from '@storybook/react-native';

import { FormField } from '@/components/ui';

const meta = {
  title: 'Basics/FormField',
  component: FormField,
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    icon: require('../../assets/figma/field-mail.svg'),
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const WithHint: Story = {
  args: { label: 'Password', placeholder: 'At least 8 characters', hint: 'Use at least 8 characters.', icon: require('../../assets/figma/field-lock.svg') },
};
export const WithError: Story = { args: { defaultValue: 'anna@', error: 'Please enter a valid email.' } };
