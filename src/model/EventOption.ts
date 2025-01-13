import type { Task } from './Task';

export interface EventOption {
  /**
   * Time step value for date changes.
   */
  readonly timeStep?: number;
  /**
   * Invokes on bar select on unselect.
   */
  readonly onSelect?: (task: Task, isSelected: boolean) => void;
  /**
   * Invokes on bar double click.
   */
  readonly onDoubleClick?: (task: Task) => void;
  /**
   * Invokes on bar click.
   */
  readonly onClick?: (task: Task) => void;
  /**
   * Invokes on end and start time change. Chart undoes operation if method return false or error.
   */
  readonly onDateChange?: (
    task: Task,
    children: Task[],
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on progress change. Chart undoes operation if method return false or error.
   */
  readonly onProgressChange?: (
    task: Task,
    children: Task[],
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on delete selected task. Chart undoes operation if method return false or error.
   */
  readonly onDelete?: (
    task: Task,
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on expander on task list
   */
  readonly onExpanderClick?: (task: Task) => void;
}
