import type { ReactNode, RefObject } from 'react';
import { useEffect, useRef } from 'react';
import type { Task } from '~/model/public/Task';
import type { BarTask } from '~/model/BarTask';

export const TaskList = ({
  headerHeight,
  fontSize,
  rowWidth,
  rowHeight,
  scrollY,
  tasks,
  selectedTask,
  setSelectedTask,
  onExpanderClick,
  locale,
  ganttHeight,
  taskListRef,
  horizontalContainerClass,
  TaskListHeader,
  TaskListTable,
}: TaskListProps) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps = {
    headerHeight,
    fontSize,
    rowWidth,
  };
  const selectedTaskId = selectedTask ? selectedTask.id : '';
  const tableProps = {
    rowHeight,
    rowWidth,
    fontSize,
    tasks,
    locale,
    selectedTaskId: selectedTaskId,
    setSelectedTask,
    onExpanderClick,
  };

  return (
    <div ref={taskListRef}>
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={ganttHeight ? { height: ganttHeight } : {}}
      >
        <TaskListTable {...tableProps} />
      </div>
    </div>
  );
};

type TaskListProps = {
  readonly headerHeight: number;
  readonly rowWidth: string;
  readonly fontSize: string;
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
    readonly fontSize: string;
  }) => ReactNode;
  readonly TaskListTable: (props: {
    readonly rowHeight: number;
    readonly rowWidth: string;
    readonly fontSize: string;
    readonly locale: string;
    readonly tasks: Task[];
    readonly selectedTaskId: string;
    readonly setSelectedTask: (taskId: string) => void;
    readonly onExpanderClick: (task: Task) => void;
  }) => ReactNode;
};
