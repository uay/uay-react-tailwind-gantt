import React, { useEffect, useRef, useState } from 'react';
import { GanttContentMoveAction } from '../../model/GanttContentMoveAction';
import { BarTask } from '../../model/BarTask';
import { getProgressPoint } from '../../helpers/getProgressPoint';

export const TaskItem: React.FC<TaskItemProps> = props => {
  const {
    task,
    arrowIndent,
    isDelete,
    taskHeight,
    isSelected,
    rtl,
    onEventStart,
  } = props;

  const textRef = useRef<SVGTextElement>(null);
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);

  useEffect(() => {
    switch (task.typeInternal) {
      case 'milestone':
        setTaskItem(<Milestone {...props} />);
        break;
      case 'project':
        setTaskItem(<Project {...props} />);
        break;
      case 'smalltask':
        setTaskItem(<BarSmall {...props} />);
        break;
      default:
        setTaskItem(<Bar {...props} />);
        break;
    }
  }, [task, isSelected]);

  useEffect(() => {
    if (textRef.current) {
      setIsTextInside(textRef.current.getBBox().width < task.x2 - task.x1);
    }
  }, [textRef, task]);

  const getX = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    if (isTextInside) {
      return task.x1 + width * 0.5;
    }
    if (rtl && textRef.current) {
      return (
        task.x1 -
        textRef.current.getBBox().width -
        arrowIndent * +hasChild -
        arrowIndent * 0.2
      );
    } else {
      return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
    }
  };

  return (
    <g
      onKeyDown={e => {
        if (e.key === 'Delete' && isDelete) {
          onEventStart('delete', task, e);
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => onEventStart('mouseenter', task, e)}
      onMouseLeave={e => onEventStart('mouseleave', task, e)}
      onDoubleClick={e => onEventStart('dblclick', task, e)}
      onClick={e => onEventStart('click', task, e)}
      onFocus={() => onEventStart('select', task)}
    >
      {taskItem}
      <text
        x={getX()}
        y={task.y + taskHeight * 0.5}
        className={`${
          isTextInside
            ? 'fill-white text-center font-light select-none pointer-events-none'
            : 'fill-gray-700 text-start select-none pointer-events-none'
        }`}
        ref={textRef}
      >
        {task.name}
      </text>
    </g>
  );
};

type TaskItemProps = {
  readonly task: BarTask;
  readonly arrowIndent: number;
  readonly taskHeight: number;
  readonly isProgressChangeable: boolean;
  readonly isDateChangeable: boolean;
  readonly isDelete: boolean;
  readonly isSelected: boolean;
  readonly rtl: boolean;
  readonly onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => any;
};

const Milestone: React.FC<MilestoneProps> = ({
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
    <g tabIndex={0} className="cursor-pointer outline-none">
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
        onMouseDown={e => {
          isDateChangeable && onEventStart('move', task, e);
        }}
      />
    </g>
  );
};

type MilestoneProps = {
  readonly task: BarTask;
  readonly arrowIndent: number;
  readonly taskHeight: number;
  readonly isProgressChangeable: boolean;
  readonly isDateChangeable: boolean;
  readonly isDelete: boolean;
  readonly isSelected: boolean;
  readonly rtl: boolean;
  readonly onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => any;
};

const Project: React.FC<ProjectProps> = ({ task, isSelected }) => {
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
    <g tabIndex={0} className="cursor-pointer outline-none">
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
  readonly task: BarTask;
  readonly arrowIndent: number;
  readonly taskHeight: number;
  readonly isProgressChangeable: boolean;
  readonly isDateChangeable: boolean;
  readonly isDelete: boolean;
  readonly isSelected: boolean;
  readonly rtl: boolean;
  readonly onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => any;
};

const BarSmall: React.FC<BarSmallProps> = ({
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
  readonly task: BarTask;
  readonly arrowIndent: number;
  readonly taskHeight: number;
  readonly isProgressChangeable: boolean;
  readonly isDateChangeable: boolean;
  readonly isDelete: boolean;
  readonly isSelected: boolean;
  readonly rtl: boolean;
  readonly onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => any;
};

const Bar: React.FC<BarProps> = ({
                                   task,
                                   isProgressChangeable,
                                   isDateChangeable,
                                   rtl,
                                   onEventStart,
                                   isSelected,
                                 }) => {
  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth + task.progressX,
    task.y,
    task.height,
  );
  const handleHeight = task.height - 2;

  return (
    <g className="cursor-pointer outline-none group" tabIndex={0}>
      {/* Bar Display */}
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

      <g className="group-hover:visible">
        {isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={task.x1 + 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart('start', task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart('end', task, e);
              }}
            />
          </g>
        )}
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

type BarProps = {
  readonly task: BarTask;
  readonly arrowIndent: number;
  readonly taskHeight: number;
  readonly isProgressChangeable: boolean;
  readonly isDateChangeable: boolean;
  readonly isDelete: boolean;
  readonly isSelected: boolean;
  readonly rtl: boolean;
  readonly onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => any;
};

const BarProgressHandle: React.FC<BarProgressHandleProps> = ({
                                                               progressPoint,
                                                               onMouseDown,
                                                             }) => {
  return (
    <polygon
      className="fill-gray-300 cursor-ew-resize opacity-0 invisible"
      points={progressPoint}
      onMouseDown={onMouseDown}
    />
  );
};

type BarProgressHandleProps = {
  readonly progressPoint: string;
  readonly onMouseDown: (
    event: React.MouseEvent<SVGPolygonElement, MouseEvent>,
  ) => void;
};

const BarDisplay: React.FC<BarDisplayProps> = ({
                                                 x,
                                                 y,
                                                 width,
                                                 height,
                                                 isSelected,
                                                 progressX,
                                                 progressWidth,
                                                 barCornerRadius,
                                                 styles,
                                                 onMouseDown,
                                               }) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className="select-none stroke-0"
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
      />
    </g>
  );
};

type BarDisplayProps = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly isSelected: boolean;
  /* progress start point */
  readonly progressX: number;
  readonly progressWidth: number;
  readonly barCornerRadius: number;
  readonly styles: {
    readonly backgroundColor: string;
    readonly backgroundSelectedColor: string;
    readonly progressColor: string;
    readonly progressSelectedColor: string;
  };
  readonly onMouseDown: (
    event: React.MouseEvent<SVGPolygonElement, MouseEvent>,
  ) => void;
};

const BarDateHandle: React.FC<BarDateHandleProps> = ({
                                                       x,
                                                       y,
                                                       width,
                                                       height,
                                                       barCornerRadius,
                                                       onMouseDown,
                                                     }) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      className="fill-gray-300 cursor-ew-resize opacity-0 invisible"
      ry={barCornerRadius}
      rx={barCornerRadius}
      onMouseDown={onMouseDown}
    />
  );
};

type BarDateHandleProps = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly barCornerRadius: number;
  readonly onMouseDown: (event: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
};
