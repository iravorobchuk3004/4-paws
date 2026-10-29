import type { PetProfile } from '@/data/profiles';

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

// Popular-now tiles; `kinds` decides which tiles show for the Dogs / Cats / Other switch.
export const categories: { label: string; photo: number; kinds: PetProfile['kind'][] }[] = [
  { label: 'Puppies', photo: require('../../assets/figma/cat-puppies.jpg'), kinds: ['dog'] },
  { label: 'Kittens', photo: require('../../assets/figma/cat-kittens.jpg'), kinds: ['cat'] },
  { label: 'Rabbits', photo: require('../../assets/figma/cat-rabbits.jpg'), kinds: ['other'] },
  { label: 'Calm seniors', photo: require('../../assets/figma/cat-seniors.jpg'), kinds: ['dog', 'cat'] },
  { label: 'Birds', photo: require('../../assets/pets/kiwi.jpg'), kinds: ['other'] },
  { label: 'Active dogs', photo: require('../../assets/figma/cat-active.jpg'), kinds: ['dog'] },
];

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
    quote: '“She was scared of everyone at the shelter. Now she sleeps on my feet every night.”',
    now: require('../../assets/figma/story-anna-now.jpg'),
    avatar: require('../../assets/figma/story-anna-avatar.png'),
  },
  {
    id: 'tom',
    names: 'Tom & Rex',
    meta: 'Adopted 1 year ago · Happy Tails',
    quote: '“Rex waited 2 years in the shelter. Now he never leaves my side on our morning runs.”',
    now: require('../../assets/figma/story-tom-now.jpg'),
    avatar: require('../../assets/figma/story-tom-avatar.png'),
  },
];
