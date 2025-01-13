import type { BarMoveAction } from '~/model/BarMoveAction';

export type GanttContentMoveAction =
  | 'mouseenter'
  | 'mouseleave'
  | 'delete'
  | 'dblclick'
  | 'click'
  | 'select'
  | ''
  | BarMoveAction;
