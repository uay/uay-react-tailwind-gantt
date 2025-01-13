import type { ViewMode } from '~/model/public/ViewMode';

export interface DateSetup {
  readonly dates: Date[];
  readonly viewMode: ViewMode;
}
