import { useContext } from 'react';
import { EventOptionsContext } from '~/context/EventOptionsContext';
import type { EventOptions } from '~/model/public/EventOptions';

export const useEventOptions = (): EventOptions => {
  const options = useContext(EventOptionsContext) || {};

  return {
    // Default values
    timeStep: 300000,
    ...options,
  };
};
