import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { StoryCard } from '@/components/StoryCard';
import { stories } from '@/data/pets';

const anna = stories[0];

const meta = {
  title: 'Community/StoryCard',
  component: StoryCard,
  args: {
    story: { photo: anna.now, quote: anna.quote, names: anna.names, meta: anna.meta, avatar: anna.avatar },
  },
} satisfies Meta<typeof StoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HappyTail: Story = {};
export const YourStory: Story = {
  args: {
    story: {
      photo: require('../../assets/pets/luna.jpg'),
      quote: 'Luna stands on her back legs every time I open the treat drawer.',
      names: 'Iryna & Luna',
      meta: 'Adopted 1–6 months ago · Paw Haven',
      initials: 'IV',
      mine: true,
    },
    onShare: fn(),
  },
};
