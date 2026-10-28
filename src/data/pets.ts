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
  tagColor?: string;
};

export const categories = [
  { label: 'Puppies', photo: require('../../assets/figma/cat-puppies.jpg') },
  { label: 'Kittens', photo: require('../../assets/figma/cat-kittens.jpg') },
  { label: 'Rabbits', photo: require('../../assets/figma/cat-rabbits.jpg') },
  { label: 'Calm seniors', photo: require('../../assets/figma/cat-seniors.jpg') },
  { label: 'Active dogs', photo: require('../../assets/figma/cat-active.jpg') },
];

export const perfectMatches: Pet[] = [
  {
    id: 'luna',
    name: 'Luna',
    sex: 'female',
    breed: 'Weimaraner',
    age: '3 yrs',
    distance: '1.1 km',
    photo: require('../../assets/figma/pet-luna.jpg'),
    tag: '92% match',
  },
  {
    id: 'molly',
    name: 'Molly',
    sex: 'female',
    breed: 'Retriever',
    age: '4 yrs',
    distance: '2.4 km',
    photo: require('../../assets/figma/pet-molly.jpg'),
    tag: '88% match',
  },
  {
    id: 'maxi',
    name: 'Maxi',
    sex: 'female',
    breed: 'Jack Russell',
    age: '1 yr',
    distance: '3.2 km',
    photo: require('../../assets/figma/cat-puppies.jpg'),
    tag: '85% match',
  },
];

export const mostLoved: Pet[] = [
  {
    id: 'bucks',
    name: 'Bucks',
    sex: 'male',
    breed: 'Beagle',
    age: '2 yrs',
    distance: '1.1 km',
    photo: require('../../assets/figma/pet-bucks.jpg'),
    tag: 'Urgent',
  },
  {
    id: 'cookie',
    name: 'Cookie',
    sex: 'male',
    breed: 'Toller',
    age: '1 yr',
    distance: '2.1 km',
    photo: require('../../assets/figma/pet-cookie.jpg'),
    tag: 'New',
  },
  {
    id: 'boni',
    name: 'Boni',
    sex: 'male',
    breed: 'Mixed breed',
    age: '3 yrs',
    distance: '3.0 km',
    photo: require('../../assets/figma/pet-boni.jpg'),
    tag: 'Vaccinated',
    tagColor: '#FFB6D4',
  },
];

export const stories = [
  {
    id: 'anna',
    names: 'Anna & Nala',
    meta: 'Adopted 8 months ago · Paw Haven',
    quote: '“She was scared of everyone at the shelter. Now she sleeps on my feet every night.”',
    before: require('../../assets/figma/story-anna-before.png'),
    now: require('../../assets/figma/story-anna-now.jpg'),
    avatar: require('../../assets/figma/story-anna-avatar.png'),
  },
  {
    id: 'tom',
    names: 'Tom & Rex',
    meta: 'Adopted 1 year ago · Happy Tails',
    quote: '“Rex waited 2 years in the shelter. Now he never leaves my side on our morning runs.”',
    before: require('../../assets/figma/story-tom-before.png'),
    now: require('../../assets/figma/story-tom-now.jpg'),
    avatar: require('../../assets/figma/story-tom-avatar.png'),
  },
];
