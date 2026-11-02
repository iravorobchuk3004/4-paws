import { router } from 'expo-router';

import type { Goal } from '@/store';

// After creating an account everyone lands on the "all set" screen. Adopters have
// already answered the quiz and seen their matches by then.
export function finishOnboarding() {
  router.push('/onboarding/ready');
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
