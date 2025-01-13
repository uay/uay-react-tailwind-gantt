import type { Task } from '../model/Task';
import type { BarTask } from '../model/BarTask';

export function isBarTask(task: Task | BarTask): task is BarTask {
  return (task as BarTask).x1 !== undefined;
}
