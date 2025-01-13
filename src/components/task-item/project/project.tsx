import React from 'react';
import { BarTask } from '../../../types/bar-task';
import { GanttContentMoveAction } from '../../../types/gantt-task-actions';

export const Project: React.FC<ProjectProps> = ({ task, isSelected }) => {
  const barColor = isSelected
    ? task.styles.backgroundSelectedColor
    : task.styles.backgroundColor;
  const processColor = isSelected
    ? task.styles.progressSelectedColor
    : task.styles.progressColor;
  const projectWidth = task.x2 - task.x1;

  const projectLeftTriangle = [
    task.x1,
    task.y + task.height / 2 - 1,
    task.x1,
    task.y + task.height,
    task.x1 + 15,
    task.y + task.height / 2 - 1,
  ].join(',');
  const projectRightTriangle = [
    task.x2,
    task.y + task.height / 2 - 1,
    task.x2,
    task.y + task.height,
    task.x2 - 15,
    task.y + task.height / 2 - 1,
  ].join(',');

  return (
    <g
      tabIndex={0}
      className="cursor-pointer outline-none"
    >
      <rect
        fill={barColor}
        x={task.x1}
        width={projectWidth}
        y={task.y}
        height={task.height}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        className="opacity-60 select-none"
      />
      <rect
        x={task.progressX}
        width={task.progressWidth}
        y={task.y}
        height={task.height}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        fill={processColor}
      />
      <rect
        fill={barColor}
        x={task.x1}
        width={projectWidth}
        y={task.y}
        height={task.height / 2}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        className="select-none"
      />
      <polygon
        points={projectLeftTriangle}
        fill={barColor}
        className="select-none"
      />
      <polygon
        points={projectRightTriangle}
        fill={barColor}
        className="select-none"
      />
    </g>
  );
};

type ProjectProps = {
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
