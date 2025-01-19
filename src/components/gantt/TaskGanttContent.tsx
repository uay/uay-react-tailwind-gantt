import { type RefObject, useEffect, useState } from 'react';
import { handleTaskBySVGMouseEvent } from '~/helpers/handleTaskBySVGMouseEvent';
import type { BarMoveAction } from '~/model/BarMoveAction';
import type { GanttContentMoveAction } from '~/model/GanttContentMoveAction';
import type { BarTask } from '~/model/BarTask';
import { isKeyboardEvent } from '~/helpers/isKeyboardEvent';
import { Arrow } from '~/components/other/Arrow';
import { TaskItem } from '~/components/tasklist/TaskItem';
import type { GanttEvent } from '~/model/GanttEvent';
import type { EventOptions } from '~/model/public/EventOptions';

export const TaskGanttContent = (props: TaskGanttContentProps) => {
  const point = props.svg?.current?.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // create xStep
  useEffect(() => {
    const dateDelta =
      props.dates[1].getTime() -
      props.dates[0].getTime() -
      props.dates[1].getTimezoneOffset() * 60 * 1000 +
      props.dates[0].getTimezoneOffset() * 60 * 1000;
    const newXStep = (props.timeStep * props.columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [props.columnWidth, props.dates, props.timeStep]);

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!props.ganttEvent.changedTask || !point || !props.svg?.current)
        return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        props.svg?.current.getScreenCTM()?.inverse(),
      );

      const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        props.ganttEvent.action as BarMoveAction,
        props.ganttEvent.changedTask,
        xStep,
        props.timeStep,
        initEventX1Delta,
        props.rtl,
      );
      if (isChanged) {
        props.setGanttEvent({ action: props.ganttEvent.action, changedTask });
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {
      const { action, originalSelectedTask, changedTask } = props.ganttEvent;
      if (
        !changedTask ||
        !point ||
        !props.svg?.current ||
        !originalSelectedTask
      )
        return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        props.svg?.current.getScreenCTM()?.inverse(),
      );
      const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        action as BarMoveAction,
        changedTask,
        xStep,
        props.timeStep,
        initEventX1Delta,
        props.rtl,
      );

      const isNotLikeOriginal =
        originalSelectedTask.start !== newChangedTask.start ||
        originalSelectedTask.end !== newChangedTask.end ||
        originalSelectedTask.progress !== newChangedTask.progress;

      // remove listeners
      props.svg.current.removeEventListener('mousemove', handleMouseMove);
      props.svg.current.removeEventListener('mouseup', handleMouseUp);
      props.setGanttEvent({ action: '' });
      setIsMoving(false);

      // custom operation start
      let operationSuccess = true;
      if (
        (action === 'move' || action === 'end' || action === 'start') &&
        props.onDateChange &&
        isNotLikeOriginal
      ) {
        try {
          const result = await props.onDateChange(
            newChangedTask,
            newChangedTask.barChildren,
          );
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          console.error('Error on Date Change. ' + error);
          operationSuccess = false;
        }
      } else if (props.onProgressChange && isNotLikeOriginal) {
        try {
          const result = await props.onProgressChange(
            newChangedTask,
            newChangedTask.barChildren,
          );
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          console.error('Error on Progress Change. ' + error);
          operationSuccess = false;
        }
      }

      // If operation is failed - return old state
      if (!operationSuccess) {
        props.setFailedTask(originalSelectedTask);
      }
    };

    if (
      !isMoving &&
      (props.ganttEvent.action === 'move' ||
        props.ganttEvent.action === 'end' ||
        props.ganttEvent.action === 'start' ||
        props.ganttEvent.action === 'progress') &&
      props.svg?.current
    ) {
      props.svg.current.addEventListener('mousemove', handleMouseMove);
      props.svg.current.addEventListener('mouseup', handleMouseUp);
      setIsMoving(true);
    }
  }, [
    props.ganttEvent,
    xStep,
    initEventX1Delta,
    props.onProgressChange,
    props.timeStep,
    props.onDateChange,
    props.svg,
    isMoving,
    point,
    props.rtl,
    props.setFailedTask,
    props.setGanttEvent,
  ]);

  /**
   * Method is Start point of task change
   */
  const handleBarEventStart = async (
    action: GanttContentMoveAction,
    task: BarTask,
    event?: MouseEvent | KeyboardEvent,
  ) => {
    if (!event) {
      if (action === 'select') {
        props.setSelectedTask(task.id);
      }
    }
    // Keyboard events
    else if (isKeyboardEvent(event)) {
      if (action === 'delete') {
        if (props.onDelete) {
          try {
            const result = await props.onDelete(task);
            if (result !== undefined && result) {
              props.setGanttEvent({ action, changedTask: task });
            }
          } catch (error) {
            console.error('Error on Delete. ' + error);
          }
        }
      }
    }
    // Mouse Events
    else if (action === 'mouseenter') {
      if (!props.ganttEvent.action) {
        props.setGanttEvent({
          action,
          changedTask: task,
          originalSelectedTask: task,
        });
      }
    } else if (action === 'mouseleave') {
      if (props.ganttEvent.action === 'mouseenter') {
        props.setGanttEvent({ action: '' });
      }
    } else if (action === 'dblclick') {
      !!props.onDoubleClick && props.onDoubleClick(task);
    } else if (action === 'click') {
      !!props.onClick && props.onClick(task);
    }
    // Change task event start
    else if (action === 'move') {
      if (!props.svg?.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        props.svg.current.getScreenCTM()?.inverse(),
      );
      setInitEventX1Delta(cursor.x - task.x1);
      props.setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    } else {
      props.setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    }
  };

  return (
    <g className="content">
      <g className="arrows" fill={props.arrowColor} stroke={props.arrowColor}>
        {props.tasks.map(task => {
          return task.barChildren.map(child => {
            return (
              <Arrow
                key={`Arrow from ${task.id} to ${props.tasks[child.index].id}`}
                taskFrom={task}
                taskTo={props.tasks[child.index]}
                rowHeight={props.rowHeight}
                taskHeight={props.taskHeight}
                arrowIndent={props.arrowIndent}
                rtl={props.rtl}
              />
            );
          });
        })}
      </g>
      <g className="bar">
        {props.tasks.map(task => {
          return (
            <TaskItem
              task={task}
              arrowIndent={props.arrowIndent}
              taskHeight={props.taskHeight}
              isProgressChangeable={
                !!props.onProgressChange && !task.isDisabled
              }
              isDateChangeable={!!props.onDateChange && !task.isDisabled}
              isDelete={!task.isDisabled}
              onEventStart={handleBarEventStart as any} // FIXME: Type issue
              key={task.id}
              isSelected={
                !!props.selectedTask && task.id === props.selectedTask.id
              }
              rtl={props.rtl}
            />
          );
        })}
      </g>
    </g>
  );
};

type TaskGanttContentProps = {
  readonly tasks: BarTask[];
  readonly dates: Date[];
  readonly ganttEvent: GanttEvent;
  readonly selectedTask: BarTask | undefined;
  readonly rowHeight: number;
  readonly columnWidth: number;
  readonly timeStep: number;
  readonly svg?: RefObject<SVGSVGElement>;
  readonly svgWidth: number;
  readonly taskHeight: number;
  readonly arrowColor: string;
  readonly arrowIndent: number;
  readonly rtl: boolean;
  readonly setGanttEvent: (value: GanttEvent) => void;
  readonly setFailedTask: (value: BarTask | null) => void;
  readonly setSelectedTask: (taskId: string) => void;
} & EventOptions;
