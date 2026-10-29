// Full pet profiles used by matches, pet details, meeting requests and saved animals.
export type FitRow = { icon: number; text: string; muted?: boolean };

export type PetProfile = {
  id: string;
  name: string;
  sex: 'female' | 'male';
  kind: 'dog' | 'cat' | 'other';
  categories: string[];
  addedDaysAgo: number;
  breed: string;
  age: string;
  distance: string;
  size: string;
  weight: string;
  match: number;
  // How many people saved this pet this week (drives "Most loved").
  loved: number;
  // Photo for the small Home cards when it differs from the list thumbnail.
  card?: number;
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
    categories: [],
    addedDaysAgo: 12,
    breed: 'Weimaraner',
    age: '3 yrs',
    distance: '1.1 km',
    size: 'Medium',
    weight: '24 kg',
    match: 92,
    loved: 40,
    card: require('../../assets/figma/pet-luna.jpg'),
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
    categories: ['Active dogs'],
    addedDaysAgo: 30,
    breed: 'Golden Retriever',
    age: '4 yrs',
    distance: '2.4 km',
    size: 'Large',
    weight: '29 kg',
    match: 88,
    loved: 35,
    card: require('../../assets/figma/pet-molly.jpg'),
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
    categories: ['Puppies', 'Active dogs'],
    addedDaysAgo: 3,
    breed: 'Jack Russell',
    age: '1 yr',
    distance: '3.2 km',
    size: 'Small',
    weight: '7 kg',
    match: 85,
    loved: 30,
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
    categories: ['Active dogs'],
    addedDaysAgo: 8,
    breed: 'Beagle',
    age: '2 yrs',
    distance: '1.1 km',
    size: 'Medium',
    weight: '12 kg',
    match: 79,
    loved: 128,
    card: require('../../assets/figma/pet-bucks.jpg'),
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
    categories: ['Kittens'],
    addedDaysAgo: 5,
    breed: 'Tabby cat',
    age: '1 yr',
    distance: '0.8 km',
    size: 'Small',
    weight: '4 kg',
    match: 81,
    loved: 64,
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
  {
    id: 'cookie',
    name: 'Cookie',
    sex: 'male',
    kind: 'dog',
    categories: ['Puppies', 'Active dogs'],
    addedDaysAgo: 1,
    breed: 'Toller',
    age: '1 yr',
    distance: '2.1 km',
    size: 'Medium',
    weight: '16 kg',
    match: 83,
    loved: 112,
    note: 'Playful · Happy Tails',
    shelter: 'Happy Tails',
    shelterMeta: 'Hamburg-Eimsbüttel · 12 animals in care',
    thumb: require('../../assets/figma/pet-cookie.jpg'),
    savedThumb: require('../../assets/figma/pet-cookie.jpg'),
    hero: require('../../assets/figma/pet-cookie.jpg'),
    health: ['Vaccinated', 'Microchipped'],
    fit: [
      { icon: fitIcons.walk, text: 'Loves swimming and fetch' },
      { icon: fitIcons.check, text: 'Good with other dogs' },
      { icon: fitIcons.info, text: 'Cats: not assessed yet', muted: true },
    ],
    about: 'Cookie is a bright, bouncy young Toller who just arrived. He learns fast and loves water.',
  },
  {
    id: 'boni',
    name: 'Boni',
    sex: 'male',
    kind: 'dog',
    categories: [],
    addedDaysAgo: 20,
    breed: 'Mixed breed',
    age: '3 yrs',
    distance: '3.0 km',
    size: 'Medium',
    weight: '18 kg',
    match: 80,
    loved: 96,
    note: 'Gentle · Safe Tails',
    shelter: 'Safe Tails',
    shelterMeta: 'Hamburg-Altona · 24 animals in care',
    thumb: require('../../assets/figma/pet-boni.jpg'),
    savedThumb: require('../../assets/figma/pet-boni.jpg'),
    hero: require('../../assets/figma/pet-boni.jpg'),
    health: ['Vaccinated', 'Microchipped', 'Neutered'],
    fit: [
      { icon: fitIcons.check, text: 'Gentle and relaxed' },
      { icon: fitIcons.cat, text: 'Has lived with cats' },
      { icon: fitIcons.walk, text: 'Happy with short walks' },
    ],
    about: 'Boni is a sweet, easy-going dog who loves cuddles and a quiet home.',
  },
];


const fit = (icon: keyof typeof fitIcons, text: string, muted?: boolean): FitRow => ({ icon: fitIcons[icon], text, muted });
const pawHaven = { shelter: 'Paw Haven', shelterMeta: 'Hamburg-Wandsbek · 18 animals in care' };
const safeTails = { shelter: 'Safe Tails', shelterMeta: 'Hamburg-Altona · 24 animals in care' };
const happyTails = { shelter: 'Happy Tails', shelterMeta: 'Hamburg-Eimsbüttel · 12 animals in care' };
const photo = (src: number) => ({ thumb: src, savedThumb: src, hero: src });

// Cats, rabbits, birds and a senior dog. Photos: Wikimedia Commons, CC0 / public domain (see assets/pets/CREDITS.json).
const more: PetProfile[] = [
  {
    id: 'oscar', name: 'Oscar', sex: 'male', kind: 'cat', categories: ['Calm seniors'], addedDaysAgo: 9,
    breed: 'British Shorthair', age: '9 yrs', distance: '1.6 km', size: 'Medium', weight: '5 kg', match: 90, loved: 88,
    note: 'Loves naps · Paw Haven', ...pawHaven, ...photo(require('../../assets/pets/oscar.jpg')),
    health: ['Vaccinated', 'Neutered'],
    fit: [fit('check', 'Very calm, likes routine'), fit('cat', 'Happy as an indoor cat'), fit('info', 'Needs a senior diet', true)],
    about: 'Oscar is a gentle gentleman who spends his days stretched out in the sun. He would love a quiet flat and a warm lap.',
  },
  {
    id: 'domino', name: 'Domino', sex: 'female', kind: 'cat', categories: [], addedDaysAgo: 4,
    breed: 'Domestic shorthair', age: '3 yrs', distance: '2.2 km', size: 'Medium', weight: '4 kg', match: 87, loved: 120,
    note: 'Chatty · Safe Tails', ...safeTails, ...photo(require('../../assets/pets/domino.jpg')),
    health: ['Vaccinated', 'Microchipped', 'Spayed'],
    fit: [fit('check', 'Friendly and talkative'), fit('cat', 'Gets on with other cats'), fit('info', 'Dogs: not assessed yet', true)],
    about: 'Domino greets everyone at the door and will tell you all about her day. She is a perfect first cat.',
  },
  {
    id: 'ginger', name: 'Ginger', sex: 'male', kind: 'cat', categories: [], addedDaysAgo: 15,
    breed: 'Ginger tabby', age: '4 yrs', distance: '3.4 km', size: 'Medium', weight: '5 kg', match: 78, loved: 70,
    note: 'Curious explorer · Happy Tails', ...happyTails, ...photo(require('../../assets/pets/ginger.jpg')),
    health: ['Vaccinated', 'Neutered'],
    fit: [fit('walk', 'Would love a safe garden'), fit('check', 'Confident and curious')],
    about: 'Ginger was found exploring a park in Altona. He is brave, curious and would be happiest with outdoor access.',
  },
  {
    id: 'kiki', name: 'Kiki', sex: 'female', kind: 'cat', categories: [], addedDaysAgo: 2,
    breed: 'Tabby', age: '2 yrs', distance: '0.9 km', size: 'Small', weight: '3.5 kg', match: 84, loved: 104,
    note: 'Playful · Paw Haven', ...pawHaven, ...photo(require('../../assets/pets/kiki.jpg')),
    health: ['Vaccinated', 'Microchipped', 'Spayed'],
    fit: [fit('check', 'Playful, loves wand toys'), fit('cat', 'Fine as an indoor cat')],
    about: 'Kiki is a lively tabby who keeps watch from every windowsill. She loves games and a good chin scratch.',
  },
  {
    id: 'smokey', name: 'Smokey', sex: 'male', kind: 'cat', categories: [], addedDaysAgo: 6,
    breed: 'British Longhair', age: '5 yrs', distance: '2.7 km', size: 'Large', weight: '6 kg', match: 82, loved: 140,
    urgent: true,
    note: 'Gentle giant · Safe Tails', ...safeTails, ...photo(require('../../assets/pets/smokey.jpg')),
    health: ['Vaccinated', 'Neutered'],
    fit: [fit('check', 'Calm and cuddly'), fit('info', 'Needs daily brushing', true)],
    about: 'Smokey is a big fluffy softie whose owner moved into care. He needs a new home soon and loves being brushed.',
  },
  {
    id: 'ash', name: 'Ash', sex: 'female', kind: 'cat', categories: ['Calm seniors'], addedDaysAgo: 21,
    breed: 'Domestic shorthair', age: '11 yrs', distance: '1.9 km', size: 'Medium', weight: '4 kg', match: 76, loved: 52,
    note: 'Sweet senior · Happy Tails', ...happyTails, ...photo(require('../../assets/pets/ash.jpg')),
    health: ['Vaccinated', 'Spayed'],
    fit: [fit('check', 'Quiet and affectionate'), fit('info', 'Regular vet checks', true)],
    about: 'Ash is a sweet older lady who just wants a soft blanket and someone to purr next to.',
  },
  {
    id: 'peach', name: 'Peach', sex: 'female', kind: 'cat', categories: ['Kittens'], addedDaysAgo: 1,
    breed: 'Calico kitten', age: '10 wks', distance: '1.2 km', size: 'Small', weight: '0.9 kg', match: 86, loved: 160,
    note: 'Tiny and brave · Paw Haven', ...pawHaven, ...photo(require('../../assets/pets/peach.jpg')),
    health: ['First vaccination', 'Dewormed'],
    fit: [fit('check', 'Very social kitten'), fit('cat', 'Would love a kitten friend')],
    about: 'Peach was born at a foster home and is ready to explore the world. She can move in from 12 weeks.',
  },
  {
    id: 'bean', name: 'Bean', sex: 'male', kind: 'cat', categories: ['Kittens'], addedDaysAgo: 2,
    breed: 'Tabby kitten', age: '4 mos', distance: '2.0 km', size: 'Small', weight: '1.8 kg', match: 83, loved: 132,
    note: 'Hides in boxes · Safe Tails', ...safeTails, ...photo(require('../../assets/pets/bean.jpg')),
    health: ['Vaccinated', 'Dewormed'],
    fit: [fit('check', 'Shy at first, then very playful'), fit('cat', 'Fine as an indoor cat')],
    about: 'Bean believes every drawer and box is his. He warms up quickly and then never stops playing.',
  },
  {
    id: 'rocky', name: 'Rocky', sex: 'male', kind: 'dog', categories: ['Calm seniors'], addedDaysAgo: 14,
    breed: 'Labrador', age: '10 yrs', distance: '2.8 km', size: 'Large', weight: '30 kg', match: 81, loved: 76,
    note: 'Easy-going senior · Happy Tails', ...happyTails, ...photo(require('../../assets/pets/rocky.jpg')),
    health: ['Vaccinated', 'Microchipped', 'Neutered'],
    fit: [fit('walk', 'Short, slow walks'), fit('check', 'Good with kids and dogs'), fit('cat', 'Ignores cats')],
    about: 'Rocky is a gentle old Labrador who loves sniffing walks and snoozing by the door. He is easy in every way.',
  },
  {
    id: 'snowball', name: 'Snowball', sex: 'female', kind: 'other', categories: ['Rabbits'], addedDaysAgo: 3,
    breed: 'White rabbit', age: '1 yr', distance: '1.4 km', size: 'Small', weight: '2.2 kg', match: 80, loved: 98,
    note: 'Loves greens · Paw Haven', ...pawHaven, ...photo(require('../../assets/pets/snowball.jpg')),
    health: ['Vaccinated', 'Spayed'],
    fit: [fit('check', 'Calm and easy to handle'), fit('info', 'Needs a rabbit friend and space to hop', true)],
    about: 'Snowball is a relaxed bunny who loves fresh herbs and flopping out after a busy hop around.',
  },
  {
    id: 'hazel', name: 'Hazel', sex: 'female', kind: 'other', categories: ['Rabbits'], addedDaysAgo: 10,
    breed: 'Lionhead mix rabbit', age: '2 yrs', distance: '2.5 km', size: 'Small', weight: '1.8 kg', match: 77, loved: 66,
    note: 'Curious · Safe Tails', ...safeTails, ...photo(require('../../assets/pets/hazel.jpg')),
    health: ['Vaccinated', 'Spayed'],
    fit: [fit('check', 'Curious, likes to explore'), fit('info', 'Best with another rabbit', true)],
    about: 'Hazel is a bright little rabbit who investigates everything. She would love to share a big run with a friend.',
  },
  {
    id: 'kiwi', name: 'Kiwi', sex: 'male', kind: 'other', categories: ['Birds'], addedDaysAgo: 5,
    breed: 'Budgie', age: '1 yr', distance: '3.1 km', size: 'Tiny', weight: '35 g', match: 74, loved: 58,
    note: 'Sings in the morning · Happy Tails', ...happyTails, ...photo(require('../../assets/pets/kiwi.jpg')),
    health: ['Vet checked'],
    fit: [fit('check', 'Cheerful and chatty'), fit('info', 'Best with another budgie', true)],
    about: 'Kiwi is a bright yellow budgie who starts singing at sunrise. He would love a flock friend and a big cage.',
  },
  {
    id: 'rio', name: 'Rio', sex: 'male', kind: 'other', categories: ['Birds'], addedDaysAgo: 12,
    breed: 'Cockatiel', age: '4 yrs', distance: '2.3 km', size: 'Small', weight: '90 g', match: 79, loved: 84,
    note: 'Whistles tunes · Paw Haven', ...pawHaven, ...photo(require('../../assets/pets/rio.jpg')),
    health: ['Vet checked'],
    fit: [fit('check', 'Tame, steps up on a finger'), fit('info', 'Needs daily time out of the cage', true)],
    about: 'Rio can whistle three songs and loves head scratches. He is used to people and very gentle.',
  },
];

profiles.push(...more);

// "10 wks", "4 mos" or "3 yrs" as a number of years, for sorting.
export const ageInYears = (age: string) => {
  const n = parseFloat(age);
  return age.includes('wk') ? n / 52 : age.includes('mo') ? n / 12 : n;
};

export const getProfile = (id: string) => profiles.find((p) => p.id === id) ?? profiles[0];
