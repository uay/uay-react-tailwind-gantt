import type { ThemeOverwrite } from '~/model/ThemeOverwrite';
import type { ThemeEntry } from '~/model/public/ThemeEntry';

export type ThemeOptions = Partial<Record<ThemeEntry, ThemeOverwrite>>;
