import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export interface LaunchGateState {
  isLocked: boolean;
  launchDate: Date | null;
  timeRemaining: TimeRemaining | null;
}

const LAUNCH_DATE_ENV = import.meta.env.VITE_LAUNCH_DATE;

function getLaunchDate(): Date | null {
  if (!LAUNCH_DATE_ENV) {
    console.error('[LaunchGate] Misconfiguration: VITE_LAUNCH_DATE environment variable is missing.');
    return null;
  }

  const date = new Date(LAUNCH_DATE_ENV);
  if (isNaN(date.getTime())) {
    console.error(`[LaunchGate] Misconfiguration: VITE_LAUNCH_DATE "${LAUNCH_DATE_ENV}" is not a valid date.`);
    return null;
  }

  return date;
}

function calculateTimeRemaining(targetDate: Date): TimeRemaining | null {
  const now = new Date().getTime();
  const total = targetDate.getTime() - now;

  if (total <= 0) {
    return null;
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, total };
}

function getInitialGateState(): LaunchGateState {
  const launchDate = getLaunchDate();
  if (!launchDate) {
    return { isLocked: true, launchDate: null, timeRemaining: null };
  }

  const remaining = calculateTimeRemaining(launchDate);
  return {
    isLocked: remaining !== null,
    launchDate,
    timeRemaining: remaining,
  };
}

const LaunchGateContext = createContext<LaunchGateState | null>(null);
const IsLockedContext = createContext<boolean | null>(null);

export function LaunchGateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LaunchGateState>(getInitialGateState);

  useEffect(() => {
    const launchDate = getLaunchDate();
    if (!launchDate) return;

    const updateGate = () => {
      const remaining = calculateTimeRemaining(launchDate);
      setState(prevState => {
        const isLocked = remaining !== null;
        if (
          prevState.isLocked === isLocked &&
          prevState.timeRemaining?.days === remaining?.days &&
          prevState.timeRemaining?.hours === remaining?.hours &&
          prevState.timeRemaining?.minutes === remaining?.minutes &&
          prevState.timeRemaining?.seconds === remaining?.seconds
        ) {
          return prevState;
        }
        return {
          isLocked,
          launchDate,
          timeRemaining: remaining,
        };
      });
    };

    updateGate();
    const interval = setInterval(updateGate, 1000);

    return () => clearInterval(interval);
  }, []);

  return React.createElement(
    IsLockedContext.Provider,
    { value: state.isLocked },
    React.createElement(LaunchGateContext.Provider, { value: state }, children)
  );
}

export function useIsLocked(): boolean {
  const isLocked = useContext(IsLockedContext);
  if (isLocked === null) {
    return getInitialGateState().isLocked;
  }
  return isLocked;
}

export function useLaunchGate(): LaunchGateState {
  const context = useContext(LaunchGateContext);
  if (!context) {
    return getInitialGateState();
  }
  return context;
}
