import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { Chip } from '@/components/ui';

const meta = {
  title: 'Basics/Chip',
  component: Chip,
  args: { label: 'Apartment', selected: false, variant: 'grey', onPress: fn() },
  argTypes: { variant: { control: 'select', options: ['grey', 'outline'] } },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Outline: Story = { args: { variant: 'outline', label: 'Calm seniors' } };

export const Group: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {['< 1 hour', '1–3 hours', '3+ hours'].map((o, i) => (
        <Chip key={o} label={o} selected={i === 1} />
      ))}
    </View>
  ),
};
