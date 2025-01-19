import { useContext } from 'react';
import { GanttStateContext } from '~/context/GanttStateContext';
import type { GanttState } from '~/model/GanttState';

export const useGanttState = (): GanttState => {
  return (
    useContext(GanttStateContext) ||
    ({
      tasks: [],
    } as GanttState)
  );
};
