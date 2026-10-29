import { Share } from 'react-native';

import { StoryCardData } from '@/components/StoryCard';
import { Story, User } from '@/store';

export const initialsOf = (name?: string) =>
  (name ?? '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// A story the person wrote, shaped for the Happy tails card.
export const myStoryCard = (story: Story, user: User | null): StoryCardData => ({
  photo: { uri: story.photo },
  quote: story.text,
  names: `${user?.name.split(' ')[0] ?? 'You'} & ${story.petName}`,
  meta: `Adopted ${story.when.toLowerCase()} · ${story.shelter}`,
  avatar: user?.photo ? { uri: user.photo } : undefined,
  initials: initialsOf(user?.name),
  mine: true,
});

export const shareStory = (story: Story) =>
  Share.share({
    message: `🐾 ${story.petName} found a home through 4 Paws!\n\n“${story.text}”\n\nAdopted from ${story.shelter}.`,
    url: story.photo,
  }).catch(() => {});
