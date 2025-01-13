import React from 'react';
import { BarTask } from '../../../types/bar-task';
import { GanttContentMoveAction } from '../../../types/gantt-task-actions';

export const Milestone: React.FC<MilestoneProps> = ({
                                                     task,
                                                     isDateChangeable,
                                                     onEventStart,
                                                     isSelected,
                                                   }) => {
  const transform = `rotate(45 ${task.x1 + task.height * 0.356} ${
    task.y + task.height * 0.85
  })`;

  const getBarColor = () => {
    return isSelected
      ? task.styles.backgroundSelectedColor
      : task.styles.backgroundColor;
  };

  return (
    <g
      tabIndex={0}
      className="cursor-pointer outline-none"
    >
      <rect
        fill={getBarColor()}
        x={task.x1}
        width={task.height}
        y={task.y}
        height={task.height}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        transform={transform}
        className="select-none"
        onMouseDown={(e) => {
          isDateChangeable && onEventStart('move', task, e);
        }}
      />
    </g>
  );
};

type MilestoneProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
};
