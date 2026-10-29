import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Tag } from '@/components/PetRow';

const meta = {
  title: 'Basics/Tag',
  component: Tag,
  args: { label: '92% match', tone: 'pink' },
  argTypes: { tone: { control: 'select', options: ['pink', 'purple', 'grey'] } },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pink: Story = {};
export const AllTones: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      <Tag label="92% match" />
      <Tag label="In review" tone="purple" />
      <Tag label="Withdrawn" tone="grey" />
    </View>
  ),
};
