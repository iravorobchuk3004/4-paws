import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView } from 'react-native';
import { fn } from 'storybook/test';

import { PetCard } from '@/components/PetCard';
import { toCard } from '@/data/pets';
import { getProfile, profiles } from '@/data/profiles';

const meta = {
  title: 'Pets/PetCard',
  component: PetCard,
  args: { pet: toCard(getProfile('luna'), '92% match'), onPress: fn() },
} satisfies Meta<typeof PetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Match: Story = {};
export const LongName: Story = { args: { pet: toCard(getProfile('snowball'), '80% match') } };
export const Urgent: Story = { args: { pet: toCard(getProfile('bucks'), 'Urgent') } };

export const Row: Story = {
  render: () => (
    <ScrollView horizontal contentContainerStyle={{ gap: 12 }}>
      {profiles.slice(0, 6).map((p) => (
        <PetCard key={p.id} pet={toCard(p, `${p.match}% match`)} />
      ))}
    </ScrollView>
  ),
};
