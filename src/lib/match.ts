import { PetProfile } from '@/data/profiles';

type Preferences = Record<string, string[]>;

// Adjusts a pet's base match score with the person's quiz answers.
export function matchScore(pet: PetProfile, prefs: Preferences) {
  const has = (id: string, option: string) => prefs[id]?.includes(option) ?? false;
  const active = pet.categories.includes('Active dogs');
  const calm = pet.categories.includes('Calm seniors') || pet.fit.some((f) => /calm|relaxed|quiet/i.test(f.text));
  const unsure = (topic: string) => pet.fit.some((f) => f.muted && f.text.toLowerCase().startsWith(topic));

  let score = pet.match;
  // The animals they said they'd love to meet ("Surprise me" keeps everyone in).
  const kinds = prefs.kind ?? [];
  if (kinds.length && !kinds.includes('Any')) {
    const kind = pet.categories.includes('Rabbits')
      ? 'Rabbit'
      : pet.categories.includes('Birds')
        ? 'Bird'
        : pet.kind === 'cat'
          ? 'Cat'
          : 'Dog';
    score += kinds.includes(kind) ? 6 : -18;
  }
  if (has('activity', 'Calm')) score += active ? -10 : calm ? 4 : 0;
  if (has('activity', 'Active')) score += active ? 6 : calm ? -6 : 0;
  if (has('home', 'Apartment') && pet.size === 'Large') score -= 6;
  if (has('home', 'House') && pet.kind === 'dog') score += 3;
  if (has('time', '< 1 hour') && pet.kind === 'dog') score -= 8;
  if (has('time', '3+ hours') && pet.kind === 'dog') score += 3;
  if (has('children', 'Yes') && unsure('children')) score -= 5;
  if (has('pets', 'Cat') && unsure('cats')) score -= 5;
  if (has('pets', 'Dog') && unsure('dogs')) score -= 5;
  return Math.max(40, Math.min(99, Math.round(score)));
}
