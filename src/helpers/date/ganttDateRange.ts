import type { Task } from '~/model/public/Task';
import { ViewMode } from '~/model/public/ViewMode';
import { addToDate } from '~/helpers/date/addToDate';
import { startOfDate } from '~/helpers/date/startOfDate';

export const ganttDateRange = (
  tasks: Task[],
  viewMode: ViewMode,
  preStepsCount: number,
) => {
  let newStartDate: Date = tasks[0].start;
  let newEndDate: Date = tasks[0].start;
  for (const task of tasks) {
    if (task.start < newStartDate) {
      newStartDate = task.start;
    }
    if (task.end > newEndDate) {
      newEndDate = task.end;
    }
  }
  switch (viewMode) {
    case ViewMode.Year:
      newStartDate = addToDate(newStartDate, -1, 'year');
      newStartDate = startOfDate(newStartDate, 'year');
      newEndDate = addToDate(newEndDate, 1, 'year');
      newEndDate = startOfDate(newEndDate, 'year');
      break;
    case ViewMode.QuarterYear:
      newStartDate = addToDate(newStartDate, -3, 'month');
      newStartDate = startOfDate(newStartDate, 'month');
      newEndDate = addToDate(newEndDate, 3, 'year');
      newEndDate = startOfDate(newEndDate, 'year');
      break;
    case ViewMode.Month:
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'month');
      newStartDate = startOfDate(newStartDate, 'month');
      newEndDate = addToDate(newEndDate, 1, 'year');
      newEndDate = startOfDate(newEndDate, 'year');
      break;
    case ViewMode.Week:
      newStartDate = startOfDate(newStartDate, 'day');
      newStartDate = addToDate(
        getMonday(newStartDate),
        -7 * preStepsCount,
        'day',
      );
      newEndDate = startOfDate(newEndDate, 'day');
      newEndDate = addToDate(newEndDate, 1.5, 'month');
      break;
    case ViewMode.Day:
      newStartDate = startOfDate(newStartDate, 'day');
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'day');
      newEndDate = startOfDate(newEndDate, 'day');
      newEndDate = addToDate(newEndDate, 19, 'day');
      break;
    case ViewMode.QuarterDay:
      newStartDate = startOfDate(newStartDate, 'day');
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'day');
      newEndDate = startOfDate(newEndDate, 'day');
      newEndDate = addToDate(newEndDate, 66, 'hour'); // 24(1 day)*3 - 6
      break;
    case ViewMode.HalfDay:
      newStartDate = startOfDate(newStartDate, 'day');
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'day');
      newEndDate = startOfDate(newEndDate, 'day');
      newEndDate = addToDate(newEndDate, 108, 'hour'); // 24(1 day)*5 - 12
      break;
    case ViewMode.Hour:
      newStartDate = startOfDate(newStartDate, 'hour');
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'hour');
      newEndDate = startOfDate(newEndDate, 'day');
      newEndDate = addToDate(newEndDate, 1, 'day');
      break;
  }
  return [newStartDate, newEndDate];
};

/**
 * Returns monday of current week
 * @param date date for modify
 */
const getMonday = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};
