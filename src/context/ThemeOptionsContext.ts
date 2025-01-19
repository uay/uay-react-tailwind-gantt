import { createContext } from 'react';
import type { ThemeOptions } from '~/model/public/ThemeOptions';

export const ThemeOptionsContext = createContext<ThemeOptions>({});
