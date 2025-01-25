import type { GanttContentMoveAction } from '~/model/GanttContentMoveAction';
import type { BarTask } from '~/model/BarTask';

export type OnGanttEventProps = {
  readonly action: GanttContentMoveAction;
  readonly task: BarTask;
  readonly preventDefault?: () => void;
  readonly stopPropagation?: () => void;
  readonly clientX?: number;
  readonly clientY?: number;
};
