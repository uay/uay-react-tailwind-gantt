import React from 'react';
import { getProgressPoint } from '../../../helpers/bar-helper';
import { BarDisplay } from './bar-display';
import { BarProgressHandle } from './bar-progress-handle';
import { BarTask } from '../../../types/bar-task';
import { GanttContentMoveAction } from '../../../types/gantt-task-actions';

export const BarSmall: React.FC<BarSmallProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  const progressPoint = getProgressPoint(
    task.progressWidth + task.x1,
    task.y,
    task.height,
  );
  return (
    <g className="cursor-pointer outline-none" tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart('move', task, e);
        }}
      />
      <g className="handleGroup">
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart('progress', task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};

type BarSmallProps = {
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
