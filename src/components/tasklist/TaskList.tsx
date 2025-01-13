import React, { useEffect, useRef } from 'react';
import { Task } from '../../model/Task';
import { BarTask } from '../../model/BarTask';

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  fontFamily,
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
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
  };
  const selectedTaskId = selectedTask ? selectedTask.id : '';
  const tableProps = {
    rowHeight,
    rowWidth,
    fontFamily,
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
  readonly fontFamily: string;
  readonly fontSize: string;
  readonly rowHeight: number;
  readonly ganttHeight: number;
  readonly scrollY: number;
  readonly locale: string;
  readonly tasks: Task[];
  readonly taskListRef: React.RefObject<HTMLDivElement>;
  readonly horizontalContainerClass?: string;
  readonly selectedTask: BarTask | undefined;
  readonly setSelectedTask: (task: string) => void;
  readonly onExpanderClick: (task: Task) => void;
  readonly TaskListHeader: React.FC<{
    readonly headerHeight: number;
    readonly rowWidth: string;
    readonly fontFamily: string;
    readonly fontSize: string;
  }>;
  readonly TaskListTable: React.FC<{
    readonly rowHeight: number;
    readonly rowWidth: string;
    readonly fontFamily: string;
    readonly fontSize: string;
    readonly locale: string;
    readonly tasks: Task[];
    readonly selectedTaskId: string;
    readonly setSelectedTask: (taskId: string) => void;
    readonly onExpanderClick: (task: Task) => void;
  }>;
};
