import type { PetProfile } from '@/data/profiles';
import { colors } from '@/theme';

// Sample content from the Figma design until a real backend exists.
export type Pet = {
  id: string;
  name: string;
  sex: 'female' | 'male';
  breed: string;
  age: string;
  distance: string;
  photo: number;
  tag: string;
};

// Home categories: they filter the lists and each has a little animated mascot.
export type Motion = 'wag' | 'tilt' | 'hop' | 'flap' | 'sleep' | 'run' | 'spin';
export type Category = { label: string; emoji: string; color: string; motion: Motion; kinds: PetProfile['kind'][] };

export const categories: Category[] = [
  { label: 'Puppies', emoji: '🐶', color: colors.yellowSoft, motion: 'wag', kinds: ['dog'] },
  { label: 'Kittens', emoji: '🐱', color: colors.pinkLight, motion: 'tilt', kinds: ['cat'] },
  { label: 'Rabbits', emoji: '🐰', color: colors.limeSoft, motion: 'hop', kinds: ['other'] },
  { label: 'Birds', emoji: '🦜', color: colors.yellowSoft, motion: 'flap', kinds: ['other'] },
  { label: 'Calm seniors', emoji: '🐕', color: colors.purpleTint, motion: 'sleep', kinds: ['dog', 'cat'] },
  { label: 'Active dogs', emoji: '🦮', color: colors.limeSoft, motion: 'run', kinds: ['dog'] },
];
export const allCategory: Category = { label: 'All', emoji: '🐾', color: colors.pinkLight, motion: 'spin', kinds: ['dog', 'cat', 'other'] };

// Small Home card built from a full profile.
export const toCard = (p: PetProfile, tag: string): Pet => ({
  id: p.id,
  name: p.name,
  sex: p.sex,
  breed: p.breed,
  age: p.age,
  distance: p.distance,
  photo: p.card ?? p.thumb,
  tag,
});

export const stories = [
  {
    id: 'anna',
    names: 'Anna & Nala',
    meta: 'Adopted 8 months ago · Paw Haven',
    quote: 'She was scared of everyone at the shelter. Now she sleeps on my feet every night.',
    now: require('../../assets/figma/story-anna-now.jpg'),
    avatar: require('../../assets/figma/story-anna-avatar.png'),
  },
  {
    id: 'tom',
    names: 'Tom & Rex',
    meta: 'Adopted 1 year ago · Happy Tails',
    quote: 'Rex waited 2 years in the shelter. Now he never leaves my side on our morning runs.',
    now: require('../../assets/figma/story-tom-now.jpg'),
    avatar: require('../../assets/figma/story-tom-avatar.png'),
  },
];
