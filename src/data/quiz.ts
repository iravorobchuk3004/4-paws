import type { Critter } from '@/components/Celebration';
import { colors } from '@/theme';

export type Answers = Record<string, string[]>;

export type Option = { value: string; label: string; emoji: string; hint?: string };

export type QuizStep =
  | {
      type: 'question';
      id: string;
      title: string;
      subtitle?: string;
      options: Option[];
      // Multi-select questions get a Continue button; single-select ones advance on tap.
      multi?: boolean;
      // An option that clears the others when picked (e.g. "No other pets").
      exclusive?: string;
    }
  | {
      type: 'fact';
      id: string;
      color: string;
      mascot: Critter;
      big: string;
      title: string;
      text: (answers: Answers) => string;
    }
  | {
      type: 'proof';
      id: string;
    }
  | {
      type: 'statement';
      id: string;
      statement: string;
    };

export const goalStep: QuizStep = {
  type: 'question',
  id: 'goal',
  title: 'What brings you to 4 Paws?',
  options: [
    { value: 'adopt', label: 'I want to adopt', emoji: '🏡', hint: 'Find a pet who fits your life' },
    { value: 'help', label: 'I want to help', emoji: '💜', hint: 'Support a pet’s care' },
    { value: 'found', label: 'I found a pet', emoji: '📍', hint: 'Get help for a lost animal' },
    { value: 'explore', label: 'Just looking around', emoji: '👀' },
  ],
};

// The lifestyle questions. They also make up the Filters / Preferences flow, without the extras.
export const lifestyle: QuizStep[] = [
  {
    type: 'question',
    id: 'kind',
    title: 'Who would you love to meet?',
    subtitle: 'Pick as many as you like.',
    multi: true,
    exclusive: 'Any',
    options: [
      { value: 'Dog', label: 'A dog', emoji: '🐶' },
      { value: 'Cat', label: 'A cat', emoji: '🐱' },
      { value: 'Rabbit', label: 'A rabbit', emoji: '🐰' },
      { value: 'Bird', label: 'A bird', emoji: '🦜' },
      { value: 'Any', label: 'Surprise me', emoji: '✨' },
    ],
  },
  {
    type: 'question',
    id: 'home',
    title: 'Where do you live?',
    options: [
      { value: 'Apartment', label: 'Apartment', emoji: '🏢' },
      { value: 'House', label: 'House with a garden', emoji: '🏡' },
    ],
  },
  {
    type: 'question',
    id: 'activity',
    title: 'What are your days like?',
    options: [
      { value: 'Calm', label: 'Calm and cosy', emoji: '🛋️', hint: 'Books, films, slow mornings' },
      { value: 'Balanced', label: 'A bit of everything', emoji: '🚶', hint: 'Walks after work, lazy Sundays' },
      { value: 'Active', label: 'Always on the move', emoji: '🏃', hint: 'Runs, hikes, weekends outside' },
    ],
  },
  {
    type: 'question',
    id: 'time',
    title: 'How much time can you give a pet each day?',
    options: [
      { value: '< 1 hour', label: 'Under an hour', emoji: '⏱️' },
      { value: '1–3 hours', label: '1–3 hours', emoji: '🕐' },
      { value: '3+ hours', label: 'More than 3 hours', emoji: '🌞' },
    ],
  },
  {
    type: 'question',
    id: 'children',
    title: 'Are there children at home?',
    options: [
      { value: 'Yes', label: 'Yes', emoji: '👧' },
      { value: 'No', label: 'No', emoji: '🙅' },
    ],
  },
  {
    type: 'question',
    id: 'pets',
    title: 'Do you already have pets?',
    subtitle: 'Pick all that apply.',
    multi: true,
    exclusive: 'None',
    options: [
      { value: 'Dog', label: 'A dog', emoji: '🐕' },
      { value: 'Cat', label: 'A cat', emoji: '🐈' },
      { value: 'Other', label: 'Another animal', emoji: '🐹' },
      { value: 'None', label: 'No pets yet', emoji: '🌱' },
    ],
  },
];

const step = (id: string) => lifestyle.find((s) => s.id === id)!;

// The full first-run quiz: questions with a few friendly breaks in between.
export const onboardingQuiz: QuizStep[] = [
  goalStep,
  step('kind'),
  step('home'),
  {
    type: 'fact',
    id: 'fact-home',
    color: colors.lime,
    mascot: 'cat',
    big: '7 in 10',
    title: 'pets in our shelters are happy in a flat',
    text: (a) =>
      a.home?.includes('House')
        ? 'A garden is a dream for active dogs, and we’ll show you who’d love yours.'
        : 'Cats, rabbits and many small dogs don’t need a garden. They need you.',
  },
  step('activity'),
  step('time'),
  step('children'),
  step('pets'),
  { type: 'proof', id: 'proof' },
  {
    type: 'statement',
    id: 'patience',
    statement: 'I’m happy to take a few weeks to find the right pet.',
  },
];
