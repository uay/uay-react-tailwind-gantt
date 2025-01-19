import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { GanttContentMoveAction } from '~/model/GanttContentMoveAction';
import type { BarTask } from '~/model/BarTask';
import { getProgressPoint } from '~/helpers/getProgressPoint';

export const TaskItem = (props: TaskItemProps) => {
  const textRef = useRef<SVGTextElement>(null);
  const [taskItem, setTaskItem] = useState<ReactElement>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);

  useEffect(() => {
    switch (props.task.typeInternal) {
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
  }, [props.task, props.isSelected]);

  useEffect(() => {
    if (textRef.current) {
      setIsTextInside(
        textRef.current.getBBox().width < props.task.x2 - props.task.x1,
      );
    }
  }, [textRef, props.task]);

  const getX = () => {
    const width = props.task.x2 - props.task.x1;
    const hasChild = props.task.barChildren.length > 0;
    if (isTextInside) {
      return props.task.x1 + width * 0.5;
    }
    if (props.rtl && textRef.current) {
      return (
        props.task.x1 -
        textRef.current.getBBox().width -
        props.arrowIndent * +hasChild -
        props.arrowIndent * 0.2
      );
    } else {
      return (
        props.task.x1 +
        width +
        props.arrowIndent * +hasChild +
        props.arrowIndent * 0.2
      );
    }
  };

  return (
    <g
      onKeyDown={e => {
        if (e.key === 'Delete' && props.isDelete) {
          props.onEventStart('delete', props.task, e);
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => props.onEventStart('mouseenter', props.task, e)}
      onMouseLeave={e => props.onEventStart('mouseleave', props.task, e)}
      onDoubleClick={e => props.onEventStart('dblclick', props.task, e)}
      onClick={e => props.onEventStart('click', props.task, e)}
      onFocus={() => props.onEventStart('select', props.task)}
    >
      {taskItem}
      <text
        x={getX()}
        y={props.task.y + props.taskHeight * 0.5}
        className={`${
          isTextInside
            ? 'fill-white text-center font-light select-none pointer-events-none'
            : 'fill-gray-700 text-start select-none pointer-events-none'
        }`}
        ref={textRef}
      >
        {props.task.name}
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

const Milestone = (props: MilestoneProps) => {
  const transform = `rotate(45 ${props.task.x1 + props.task.height * 0.356} ${
    props.task.y + props.task.height * 0.85
  })`;

  const getBarColor = () => {
    return props.isSelected
      ? props.task.styles.backgroundSelectedColor
      : props.task.styles.backgroundColor;
  };

  return (
    <g tabIndex={0} className="cursor-pointer outline-none">
      <rect
        fill={getBarColor()}
        x={props.task.x1}
        width={props.task.height}
        y={props.task.y}
        height={props.task.height}
        rx={props.task.barCornerRadius}
        ry={props.task.barCornerRadius}
        transform={transform}
        className="select-none"
        onMouseDown={e => {
          props.isDateChangeable && props.onEventStart('move', props.task, e);
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

const Project = (props: ProjectProps) => {
  const barColor = props.isSelected
    ? props.task.styles.backgroundSelectedColor
    : props.task.styles.backgroundColor;
  const processColor = props.isSelected
    ? props.task.styles.progressSelectedColor
    : props.task.styles.progressColor;
  const projectWidth = props.task.x2 - props.task.x1;

  const projectLeftTriangle = [
    props.task.x1,
    props.task.y + props.task.height / 2 - 1,
    props.task.x1,
    props.task.y + props.task.height,
    props.task.x1 + 15,
    props.task.y + props.task.height / 2 - 1,
  ].join(',');
  const projectRightTriangle = [
    props.task.x2,
    props.task.y + props.task.height / 2 - 1,
    props.task.x2,
    props.task.y + props.task.height,
    props.task.x2 - 15,
    props.task.y + props.task.height / 2 - 1,
  ].join(',');

  return (
    <g tabIndex={0} className="cursor-pointer outline-none">
      <rect
        fill={barColor}
        x={props.task.x1}
        width={projectWidth}
        y={props.task.y}
        height={props.task.height}
        rx={props.task.barCornerRadius}
        ry={props.task.barCornerRadius}
        className="opacity-60 select-none"
      />
      <rect
        x={props.task.progressX}
        width={props.task.progressWidth}
        y={props.task.y}
        height={props.task.height}
        rx={props.task.barCornerRadius}
        ry={props.task.barCornerRadius}
        fill={processColor}
      />
      <rect
        fill={barColor}
        x={props.task.x1}
        width={projectWidth}
        y={props.task.y}
        height={props.task.height / 2}
        rx={props.task.barCornerRadius}
        ry={props.task.barCornerRadius}
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

const BarSmall = (props: BarSmallProps) => {
  const progressPoint = getProgressPoint(
    props.task.progressWidth + props.task.x1,
    props.task.y,
    props.task.height,
  );

  return (
    <g className="cursor-pointer outline-none" tabIndex={0}>
      <BarDisplay
        x={props.task.x1}
        y={props.task.y}
        width={props.task.x2 - props.task.x1}
        height={props.task.height}
        progressX={props.task.progressX}
        progressWidth={props.task.progressWidth}
        barCornerRadius={props.task.barCornerRadius}
        styles={props.task.styles}
        isSelected={props.isSelected}
        onMouseDown={e => {
          props.isDateChangeable && props.onEventStart('move', props.task, e);
        }}
      />
      <g className="handleGroup">
        {props.isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              props.onEventStart('progress', props.task, e);
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

const Bar = (props: BarProps) => {
  const progressPoint = getProgressPoint(
    +!props.rtl * props.task.progressWidth + props.task.progressX,
    props.task.y,
    props.task.height,
  );
  const handleHeight = props.task.height - 2;

  return (
    <g className="cursor-pointer outline-none group" tabIndex={0}>
      {/* Bar Display */}
      <BarDisplay
        x={props.task.x1}
        y={props.task.y}
        width={props.task.x2 - props.task.x1}
        height={props.task.height}
        progressX={props.task.progressX}
        progressWidth={props.task.progressWidth}
        barCornerRadius={props.task.barCornerRadius}
        styles={props.task.styles}
        isSelected={props.isSelected}
        onMouseDown={e => {
          props.isDateChangeable && props.onEventStart('move', props.task, e);
        }}
      />

      <g className="group-hover:visible">
        {props.isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={props.task.x1 + 1}
              y={props.task.y + 1}
              width={props.task.handleWidth}
              height={handleHeight}
              barCornerRadius={props.task.barCornerRadius}
              onMouseDown={e => {
                props.onEventStart('start', props.task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={props.task.x2 - props.task.handleWidth - 1}
              y={props.task.y + 1}
              width={props.task.handleWidth}
              height={handleHeight}
              barCornerRadius={props.task.barCornerRadius}
              onMouseDown={e => {
                props.onEventStart('end', props.task, e);
              }}
            />
          </g>
        )}
        {props.isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              props.onEventStart('progress', props.task, e);
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

const BarProgressHandle = (props: BarProgressHandleProps) => {
  return (
    <polygon
      className="fill-gray-300 cursor-ew-resize opacity-0 invisible"
      points={props.progressPoint}
      onMouseDown={props.onMouseDown}
    />
  );
};

type BarProgressHandleProps = {
  readonly progressPoint: string;
  readonly onMouseDown: (
    event: React.MouseEvent<SVGPolygonElement, MouseEvent>,
  ) => void;
};

const BarDisplay = (props: BarDisplayProps) => {
  const getProcessColor = () => {
    return props.isSelected
      ? props.styles.progressSelectedColor
      : props.styles.progressColor;
  };

  const getBarColor = () => {
    return props.isSelected
      ? props.styles.backgroundSelectedColor
      : props.styles.backgroundColor;
  };

  return (
    <g onMouseDown={props.onMouseDown}>
      <rect
        x={props.x}
        width={props.width}
        y={props.y}
        height={props.height}
        ry={props.barCornerRadius}
        rx={props.barCornerRadius}
        fill={getBarColor()}
        className="select-none stroke-0"
      />
      <rect
        x={props.progressX}
        width={props.progressWidth}
        y={props.y}
        height={props.height}
        ry={props.barCornerRadius}
        rx={props.barCornerRadius}
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

const BarDateHandle = (props: BarDateHandleProps) => {
  return (
    <rect
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      className="fill-gray-300 cursor-ew-resize opacity-0 invisible"
      ry={props.barCornerRadius}
      rx={props.barCornerRadius}
      onMouseDown={props.onMouseDown}
    />
  );
};

type BarDateHandleProps = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly barCornerRadius: number;
  readonly onMouseDown: (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
  ) => void;
};
