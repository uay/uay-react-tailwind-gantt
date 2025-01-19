import { useContext } from 'react';
import { DisplayOptionsContext } from '~/context/DisplayOptionsContext';
import type { DisplayOptions } from '~/model/public/DisplayOptions';
import { ViewMode } from '~/model/public/ViewMode';

export const useDisplayOptions = (): DisplayOptions => {
  const options = useContext(DisplayOptionsContext) || {};

  return {
    // Default values
    viewMode: ViewMode.Day,
    preStepsCount: 1,
    locale: 'en-GB',
    rtl: false,
    ...options,
  };
};
