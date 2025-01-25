import type { Task } from 'uay-react-tailwind-gantt';

/**
 * Returns the start and end date of a project as UTC timestamps or 0 if no date is found.
 *
 * TODO: Very good case to unit test
 */
export function getStartEndDateForProject(tasks: Task[], projectId: string): [number, number] {
  let start = 0;
  let end = 0;

  if (!tasks.length) {
    return [start, end];
  }

  const projectTasks = tasks.filter(t => t.project === projectId);

  if (!projectTasks.length) {
    return [start, end];
  }

  start = projectTasks[0].start?.getTime() || start;
  end = projectTasks[0].end?.getTime() || end;

  for (const task of projectTasks) {
    const tsStart = task.start?.getTime() || 0;

    if (tsStart) {
      if (!start) {
        start = tsStart;
      } else {
        start = Math.min(start, tsStart);
      }
    }

    const tsEnd = task.end?.getTime() || 0;

    if (tsEnd) {
      if (!end) {
        end = tsEnd;
      } else {
        end = Math.max(end, tsEnd);
      }
    }
  }

  return [start, end];
}
