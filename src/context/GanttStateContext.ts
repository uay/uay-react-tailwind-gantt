import { createContext } from 'react';
import type { Task } from '~/model/public/Task';

export const GanttStateContext = createContext<{
  readonly tasks: Task[];
}>({
  tasks: [],
});
