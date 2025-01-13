import type { BarTask } from './BarTask';
import type { GanttContentMoveAction } from './GanttContentMoveAction';

export type GanttEvent = {
  readonly changedTask?: BarTask;
  readonly originalSelectedTask?: BarTask;
  readonly action: GanttContentMoveAction;
};
