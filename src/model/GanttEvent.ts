import { BarTask } from './BarTask';
import { GanttContentMoveAction } from './GanttContentMoveAction';

export type GanttEvent = {
  changedTask?: BarTask;
  originalSelectedTask?: BarTask;
  action: GanttContentMoveAction;
};
