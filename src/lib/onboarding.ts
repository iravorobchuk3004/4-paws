import { router } from 'expo-router';

import { Goal } from '@/store';

// Where a new user goes after creating an account: adopters answer the lifestyle
// questions first, everyone else goes straight to the "all set" screen.
export function finishOnboarding(goal: Goal) {
  if (goal === 'adopt') router.push('/onboarding/about-you');
  else router.push('/onboarding/ready');
}

// Final hop from the "all set" screen into the part of the app that fits the goal.
export function enterApp(goal: Goal) {
  router.dismissAll();
  switch (goal) {
    case 'adopt':
      router.replace('/matches');
      break;
    case 'help':
      router.replace('/(tabs)/support');
      break;
    case 'found':
      router.replace('/(tabs)');
      router.push('/found');
      break;
    default:
      router.replace('/(tabs)');
  }
}
