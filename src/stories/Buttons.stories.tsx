import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { PrimaryButton, SecondaryButton } from '@/components/ui';

const meta = {
  title: 'Basics/Buttons',
  component: PrimaryButton,
  args: { title: 'Apply for a meeting', onPress: fn() },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryWithIcon: Story = {
  args: { title: 'Get started', icon: require('../../assets/figma/arrow-right-white.svg') },
};

export const Secondary: Story = {
  render: (args) => <SecondaryButton title={args.title} onPress={args.onPress} />,
  args: { title: 'Explore as a guest' },
};
