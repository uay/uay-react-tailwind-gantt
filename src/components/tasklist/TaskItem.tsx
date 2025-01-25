import type { MouseEventHandler, ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { BarTask } from '~/model/BarTask';
import { getProgressPoint } from '~/helpers/getProgressPoint';
import type { OnGanttEventProps } from '~/model/OnGanttEventProps';

export const TaskItem = (props: TaskItemProps) => {
  const textRef = useRef<SVGTextElement>(null);
  const [taskItem, setTaskItem] = useState<ReactElement>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);

  const { width: textBoxWidth, height: textBoxHeight } =
    textRef.current?.getBBox() || {
      width: 0,
      height: 0,
    };

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
    if (textBoxWidth) {
      setIsTextInside(textBoxWidth < props.task.x2 - props.task.x1);
    }
  }, [textBoxWidth, props.task]);

  const getX = () => {
    const taskWidth = props.task.x2 - props.task.x1;
    const hasChild = props.task.barChildren.length > 0;
    if (isTextInside) {
      return props.task.x1 + taskWidth * 0.5 - textBoxWidth * 0.5;
    }
    if (props.rtl && textRef.current) {
      return (
        props.task.x1 -
        textBoxWidth -
        props.arrowIndent * +hasChild -
        props.arrowIndent * 0.2
      );
    } else {
      return (
        props.task.x1 +
        taskWidth +
        props.arrowIndent * +hasChild +
        props.arrowIndent * 0.2
      );
    }
  };

  return (
    <g
      onKeyDown={e => {
        if (e.key === 'Delete' && props.isDelete) {
          props.onEventStart({
            action: 'delete',
            task: props.task,
            preventDefault: e.preventDefault,
            stopPropagation: e.stopPropagation,
          });
        }
        e.stopPropagation();
      }}
      onMouseEnter={e =>
        props.onEventStart({
          action: 'mouseenter',
          task: props.task,
          preventDefault: e.preventDefault,
          stopPropagation: e.stopPropagation,
          clientX: e.clientX,
          clientY: e.clientY,
        })
      }
      onMouseLeave={e =>
        props.onEventStart({
          action: 'mouseenter',
          task: props.task,
          preventDefault: e.preventDefault,
          stopPropagation: e.stopPropagation,
          clientX: e.clientX,
          clientY: e.clientY,
        })
      }
      onDoubleClick={e =>
        props.onEventStart({
          action: 'mouseleave',
          task: props.task,
          preventDefault: e.preventDefault,
          stopPropagation: e.stopPropagation,
          clientX: e.clientX,
          clientY: e.clientY,
        })
      }
      onClick={e =>
        props.onEventStart({
          action: 'click',
          task: props.task,
          preventDefault: e.preventDefault,
          stopPropagation: e.stopPropagation,
          clientX: e.clientX,
          clientY: e.clientY,
        })
      }
      onFocus={e =>
        props.onEventStart({
          action: 'select',
          task: props.task,
          preventDefault: e.preventDefault,
          stopPropagation: e.stopPropagation,
        })
      }
    >
      {taskItem}
      <text
        x={getX()}
        y={props.task.y + props.taskHeight * 0.5 - textBoxHeight * 0.5}
        dominantBaseline="hanging"
        className={`${
          isTextInside
            ? 'fill-white text-center font-light select-none pointer-events-none bg-black'
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
  readonly onEventStart: (props: OnGanttEventProps) => any;
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
        onMouseDown={e =>
          props.onEventStart({
            action: 'move',
            task: props.task,
            preventDefault: e.preventDefault,
            stopPropagation: e.stopPropagation,
            clientX: e.clientX,
            clientY: e.clientY,
          })
        }
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
  readonly onEventStart: (props: OnGanttEventProps) => any;
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
    <g
      tabIndex={0}
      className="cursor-pointer outline-none"
      onMouseDown={e =>
        props.onEventStart({
          action: 'move',
          task: props.task,
          preventDefault: e.preventDefault,
          stopPropagation: e.stopPropagation,
          clientX: e.clientX,
          clientY: e.clientY,
        })
      }
    >
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
  readonly onEventStart: (props: OnGanttEventProps) => any;
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
        onMouseDown={e =>
          props.onEventStart({
            action: 'move',
            task: props.task,
            preventDefault: e.preventDefault,
            stopPropagation: e.stopPropagation,
            clientX: e.clientX,
            clientY: e.clientY,
          })
        }
      />
      <g className="handleGroup">
        {props.isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e =>
              props.onEventStart({
                action: 'progress',
                task: props.task,
                preventDefault: e.preventDefault,
                stopPropagation: e.stopPropagation,
                clientX: e.clientX,
                clientY: e.clientY,
              })
            }
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
  readonly onEventStart: (props: OnGanttEventProps) => any;
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
        onMouseDown={e =>
          props.onEventStart({
            action: 'move',
            task: props.task,
            preventDefault: e.preventDefault,
            stopPropagation: e.stopPropagation,
            clientX: e.clientX,
            clientY: e.clientY,
          })
        }
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
              onMouseDown={e =>
                props.onEventStart({
                  action: 'start',
                  task: props.task,
                  preventDefault: e.preventDefault,
                  stopPropagation: e.stopPropagation,
                  clientX: e.clientX,
                  clientY: e.clientY,
                })
              }
            />
            {/* right */}
            <BarDateHandle
              x={props.task.x2 - props.task.handleWidth - 1}
              y={props.task.y + 1}
              width={props.task.handleWidth}
              height={handleHeight}
              barCornerRadius={props.task.barCornerRadius}
              onMouseDown={e =>
                props.onEventStart({
                  action: 'end',
                  task: props.task,
                  preventDefault: e.preventDefault,
                  stopPropagation: e.stopPropagation,
                  clientX: e.clientX,
                  clientY: e.clientY,
                })
              }
            />
          </g>
        )}
        {props.isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e =>
              props.onEventStart({
                action: 'progress',
                task: props.task,
                preventDefault: e.preventDefault,
                stopPropagation: e.stopPropagation,
                clientX: e.clientX,
                clientY: e.clientY,
              })
            }
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
  readonly onEventStart: (props: OnGanttEventProps) => any;
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
  readonly onMouseDown: MouseEventHandler;
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
  readonly onMouseDown: MouseEventHandler;
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
  readonly onMouseDown: MouseEventHandler;
};
