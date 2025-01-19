import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import type { Task } from '~/model/public/Task';
import type { BarTask } from '~/model/BarTask';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';
import { TaskListHeader } from '~/components/tasklist/TaskListHeader';
import { TaskListTable } from '~/components/tasklist/TaskListTable';

export const TaskList = (props: TaskListProps) => {
  const stylingOptions = useStylingOptions();

  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = props.scrollY;
    }
  }, [props.scrollY]);

  const selectedTaskId = props.selectedTask ? props.selectedTask.id : '';

  return (
    <div ref={props.taskListRef}>
      <TaskListHeader />
      <div
        ref={horizontalContainerRef}
        className={props.horizontalContainerClass}
        style={
          stylingOptions.ganttHeight
            ? { height: stylingOptions.ganttHeight }
            : {}
        }
      >
        <TaskListTable
          tasks={props.tasks}
          selectedTaskId={selectedTaskId}
          setSelectedTask={props.setSelectedTask}
          onExpanderClick={props.onExpanderClick}
        />
      </div>
    </div>
  );
};

type TaskListProps = {
  readonly tasks: Task[];
  readonly scrollY: number;
  readonly horizontalContainerClass?: string;
  readonly selectedTask: BarTask | undefined;
  readonly setSelectedTask: (task: string) => void;
  readonly taskListRef: RefObject<HTMLDivElement>;
  readonly onExpanderClick: (task: Task) => void;
};
