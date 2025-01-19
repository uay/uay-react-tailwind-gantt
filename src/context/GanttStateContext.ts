import { createContext } from 'react';
import type { GanttState } from '~/model/GanttState';

export const GanttStateContext = createContext<GanttState>({
  tasks: [],
});
