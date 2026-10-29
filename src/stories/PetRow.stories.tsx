import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { PetRow, Tag } from '@/components/PetRow';
import { getProfile } from '@/data/profiles';

const molly = getProfile('molly');

const meta = {
  title: 'Pets/PetRow',
  component: PetRow,
  args: { pet: molly, photo: molly.thumb, note: molly.note, onPress: fn() },
} satisfies Meta<typeof PetRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <Tag label="88% match" /> },
};
export const MeetingRequested: Story = {
  args: { children: <Tag label="Meeting requested" tone="purple" /> },
};
