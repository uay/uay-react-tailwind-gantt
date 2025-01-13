import type { BarTask } from '~/model/BarTask';
import type { GanttContentMoveAction } from '~/model/GanttContentMoveAction';

export type GanttEvent = {
  readonly changedTask?: BarTask;
  readonly originalSelectedTask?: BarTask;
  readonly action: GanttContentMoveAction;
};
