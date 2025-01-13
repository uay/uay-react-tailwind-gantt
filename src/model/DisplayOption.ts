import { ViewMode } from './ViewMode';

export interface DisplayOption {
  readonly viewMode?: ViewMode;
  readonly viewDate?: Date;
  readonly preStepsCount?: number;
  /**
   * Specifies the month name language. Able formats: ISO 639-2, Java Locale
   */
  readonly locale?: string;
  readonly rtl?: boolean;
}
