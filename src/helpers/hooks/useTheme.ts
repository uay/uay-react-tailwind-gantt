import { useContext } from 'react';
import { ThemeContext } from '~/context/ThemeContext';
import type { ThemeOptions } from '~/model/public/ThemeOptions';

export const useTheme = (): ThemeOptions => {
  return useContext(ThemeContext) || {};
};
