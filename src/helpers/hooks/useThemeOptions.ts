import { useContext } from 'react';
import { ThemeOptionsContext } from '~/context/ThemeOptionsContext';
import type { ThemeOptions } from '~/model/public/ThemeOptions';

export const useThemeOptions = (): ThemeOptions => {
  return useContext(ThemeOptionsContext) || {};
};
