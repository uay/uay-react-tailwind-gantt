import { BarTask } from './BarTask';
import { GanttContentMoveAction } from './GanttContentMoveAction';

export type GanttEvent = {
  readonly changedTask?: BarTask;
  readonly originalSelectedTask?: BarTask;
  readonly action: GanttContentMoveAction;
};
