import type { GanttEventType } from '~/types/GanttEventType';
import type { GanttKeyboardEventType } from '~/types/GanttKeyboardEventType';

export function isKeyboardEvent(
  event: GanttEventType,
): event is GanttKeyboardEventType {
  return (event as GanttKeyboardEventType).key !== undefined;
}
