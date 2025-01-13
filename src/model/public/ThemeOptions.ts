import type { ThemeOverwrite } from '~/model/ThemeOverwrite';
import type { ThemeGroup } from '~/model/ThemeGroup';

export type ThemeOptions = Partial<
  Record<ThemeGroup, Record<string, ThemeOverwrite>>
>;
