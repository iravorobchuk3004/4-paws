// Full pet profiles used by matches, pet details, meeting requests and saved animals.
export type FitRow = { icon: number; text: string; muted?: boolean };

export type PetProfile = {
  id: string;
  name: string;
  sex: 'female' | 'male';
  kind: 'dog' | 'cat';
  breed: string;
  age: string;
  distance: string;
  size: string;
  weight: string;
  match: number;
  note: string;
  urgent?: boolean;
  shelter: string;
  shelterMeta: string;
  thumb: number;
  savedThumb: number;
  hero: number;
  health: string[];
  fit: FitRow[];
  about: string;
};

const fitIcons = {
  check: require('../../assets/figma/fit-check.svg'),
  walk: require('../../assets/figma/fit-walk.svg'),
  cat: require('../../assets/figma/fit-cat.svg'),
  info: require('../../assets/figma/fit-info.svg'),
};

export const profiles: PetProfile[] = [
  {
    id: 'luna',
    name: 'Luna',
    sex: 'female',
    kind: 'dog',
    breed: 'Weimaraner',
    age: '3 yrs',
    distance: '1.1 km',
    size: 'Medium',
    weight: '24 kg',
    match: 92,
    note: 'Calm · lived with cats · Paw Haven',
    shelter: 'Paw Haven',
    shelterMeta: 'Hamburg-Wandsbek · 18 animals in care',
    thumb: require('../../assets/figma/m-luna.jpg'),
    savedThumb: require('../../assets/figma/saved-luna.jpg'),
    hero: require('../../assets/figma/luna-hero.jpg'),
    health: ['Vaccinated', 'Microchipped', 'Spayed'],
    fit: [
      { icon: fitIcons.check, text: 'Calm, gentle temperament' },
      { icon: fitIcons.walk, text: 'Enjoys short walks twice a day' },
      { icon: fitIcons.cat, text: 'Has lived with cats' },
      { icon: fitIcons.info, text: 'Children: not assessed yet', muted: true },
    ],
    about:
      'Luna is a sweet, calm girl who loves short walks and quiet evenings on the sofa. She came to Paw Haven after her family moved abroad and is ready for a home with a park nearby.',
  },
  {
    id: 'molly',
    name: 'Molly',
    sex: 'female',
    kind: 'dog',
    breed: 'Golden Retriever',
    age: '4 yrs',
    distance: '2.4 km',
    size: 'Large',
    weight: '29 kg',
    match: 88,
    note: 'Good with kids · Paw Haven',
    shelter: 'Paw Haven',
    shelterMeta: 'Hamburg-Wandsbek · 18 animals in care',
    thumb: require('../../assets/figma/m-molly.jpg'),
    savedThumb: require('../../assets/figma/saved-molly.jpg'),
    hero: require('../../assets/figma/pet-molly.jpg'),
    health: ['Vaccinated', 'Microchipped', 'Spayed'],
    fit: [
      { icon: fitIcons.check, text: 'Friendly and patient' },
      { icon: fitIcons.walk, text: 'Loves long walks and fetch' },
      { icon: fitIcons.check, text: 'Good with kids' },
      { icon: fitIcons.info, text: 'Cats: not assessed yet', muted: true },
    ],
    about:
      'Molly is a gentle family dog who adores children and tennis balls. She is house-trained and walks nicely on a lead.',
  },
  {
    id: 'maxi',
    name: 'Maxi',
    sex: 'male',
    kind: 'dog',
    breed: 'Jack Russell',
    age: '1 yr',
    distance: '3.2 km',
    size: 'Small',
    weight: '7 kg',
    match: 85,
    note: 'Needs daily runs · Safe Tails',
    shelter: 'Safe Tails',
    shelterMeta: 'Hamburg-Altona · 24 animals in care',
    thumb: require('../../assets/figma/m-maxi.jpg'),
    savedThumb: require('../../assets/figma/m-maxi.jpg'),
    hero: require('../../assets/figma/cat-puppies.jpg'),
    health: ['Vaccinated', 'Microchipped'],
    fit: [
      { icon: fitIcons.walk, text: 'Needs daily runs and play' },
      { icon: fitIcons.check, text: 'Quick learner' },
      { icon: fitIcons.info, text: 'Cats: not assessed yet', muted: true },
    ],
    about:
      'Maxi is a cheerful young terrier full of energy. He would love an active owner who enjoys running and games.',
  },
  {
    id: 'bucks',
    name: 'Bucks',
    sex: 'male',
    kind: 'dog',
    breed: 'Beagle',
    age: '2 yrs',
    distance: '1.1 km',
    size: 'Medium',
    weight: '12 kg',
    match: 79,
    urgent: true,
    note: 'Friendly · Safe Tails',
    shelter: 'Safe Tails',
    shelterMeta: 'Hamburg-Altona · 24 animals in care',
    thumb: require('../../assets/figma/m-bucks.jpg'),
    savedThumb: require('../../assets/figma/m-bucks.jpg'),
    hero: require('../../assets/figma/pet-bucks.jpg'),
    health: ['Vaccinated', 'Microchipped', 'Neutered'],
    fit: [
      { icon: fitIcons.check, text: 'Friendly with everyone' },
      { icon: fitIcons.walk, text: 'Loves sniffing walks' },
      { icon: fitIcons.info, text: 'Children: not assessed yet', muted: true },
    ],
    about: 'Bucks is a curious, happy beagle who needs a new home soon. He gets on well with other dogs.',
  },
  {
    id: 'milo',
    name: 'Milo',
    sex: 'male',
    kind: 'cat',
    breed: 'Tabby cat',
    age: '1 yr',
    distance: '0.8 km',
    size: 'Small',
    weight: '4 kg',
    match: 81,
    note: 'Playful · Paw Haven',
    shelter: 'Paw Haven',
    shelterMeta: 'Hamburg-Wandsbek · 18 animals in care',
    thumb: require('../../assets/figma/saved-milo.jpg'),
    savedThumb: require('../../assets/figma/saved-milo.jpg'),
    hero: require('../../assets/figma/saved-milo.jpg'),
    health: ['Vaccinated', 'Neutered'],
    fit: [
      { icon: fitIcons.check, text: 'Playful and affectionate' },
      { icon: fitIcons.cat, text: 'Fine as an indoor cat' },
    ],
    about: 'Milo is a young tabby who loves feather toys and sunny windowsills.',
  },
];

export const getProfile = (id: string) => profiles.find((p) => p.id === id) ?? profiles[0];
