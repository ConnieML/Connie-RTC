'use client';

import useLocalStorage from './use-local-storage';

/**
 * A hook that provides the state of the onboarding process.
 */
export default function useOnboardingState() {
  const { value, changeValue } = useLocalStorage<boolean>('isOnboarded', false);
  return {
    isOnboarded: value,
    setIsOnboarded: changeValue,
  };
}
