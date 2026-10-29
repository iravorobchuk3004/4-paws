// Care funds shown on the Support tab.
export type CareNeed = {
  id: string;
  name: string;
  kind: 'dog' | 'cat' | 'other';
  need: string;
  shelter: string;
  tag: string;
  urgent?: boolean;
  distanceKm: number;
  raised: number;
  goal: number;
  photo: number;
};

export const careNeeds: CareNeed[] = [
  {
    id: 'casy',
    name: 'Casy',
    kind: 'dog',
    need: 'Skin treatment',
    shelter: 'Paw Haven',
    tag: 'Medicine',
    distanceKm: 1.1,
    raised: 3200,
    goal: 5000,
    photo: require('../../assets/figma/care-casy.png'),
  },
  {
    id: 'milo',
    name: 'Milo',
    kind: 'cat',
    need: 'Eye surgery',
    shelter: 'Safe Paws',
    tag: 'Surgery',
    distanceKm: 2.6,
    raised: 1450,
    goal: 3000,
    photo: require('../../assets/figma/care-milo.jpg'),
  },
  {
    id: 'bella',
    name: 'Bella',
    kind: 'other',
    need: 'Emergency care',
    shelter: 'Little Hearts',
    tag: 'Urgent',
    urgent: true,
    distanceKm: 4.0,
    raised: 680,
    goal: 1200,
    photo: require('../../assets/figma/care-bella.jpg'),
  },
];

export const getCareNeed = (id: string) => careNeeds.find((c) => c.id === id) ?? careNeeds[0];

export const euro = (n: number) => `€${n.toLocaleString('en-US')}`;
