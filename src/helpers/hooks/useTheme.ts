import { useContext } from 'react';
import { ThemeContext } from '~/context/ThemeContext';
import type { ThemeGroup } from '~/model/ThemeGroup';

export const useTheme = (group: ThemeGroup) => {
  return useContext(ThemeContext)?.[group] || {};
};
