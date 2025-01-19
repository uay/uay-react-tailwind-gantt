import type { ReactNode, RefObject } from 'react';
import { useEffect, useRef } from 'react';
import type { Task } from '~/model/public/Task';
import type { BarTask } from '~/model/BarTask';

export const TaskList = (props: TaskListProps) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = props.scrollY;
    }
  }, [props.scrollY]);

  const headerProps = {
    headerHeight: props.headerHeight,
    rowWidth: props.rowWidth,
  };

  const selectedTaskId = props.selectedTask ? props.selectedTask.id : '';

  const tableProps = {
    rowHeight: props.rowHeight,
    rowWidth: props.rowWidth,
    tasks: props.tasks,
    locale: props.locale,
    selectedTaskId: selectedTaskId,
    setSelectedTask: props.setSelectedTask,
    onExpanderClick: props.onExpanderClick,
  };

  return (
    <div ref={props.taskListRef}>
      <props.TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={props.horizontalContainerClass}
        style={props.ganttHeight ? { height: props.ganttHeight } : {}}
      >
        <props.TaskListTable {...tableProps} />
      </div>
    </div>
  );
};

type TaskListProps = {
  readonly headerHeight: number;
  readonly rowWidth: string;
  readonly rowHeight: number;
  readonly ganttHeight: number;
  readonly scrollY: number;
  readonly locale: string;
  readonly tasks: Task[];
  readonly taskListRef: RefObject<HTMLDivElement>;
  readonly horizontalContainerClass?: string;
  readonly selectedTask: BarTask | undefined;
  readonly setSelectedTask: (task: string) => void;
  readonly onExpanderClick: (task: Task) => void;
  readonly TaskListHeader: (props: {
    readonly headerHeight: number;
    readonly rowWidth: string;
  }) => ReactNode;
  readonly TaskListTable: (props: {
    readonly rowHeight: number;
    readonly rowWidth: string;
    readonly locale: string;
    readonly tasks: Task[];
    readonly selectedTaskId: string;
    readonly setSelectedTask: (taskId: string) => void;
    readonly onExpanderClick: (task: Task) => void;
  }) => ReactNode;
};
