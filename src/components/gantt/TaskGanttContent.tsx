import { type RefObject, useEffect, useState } from 'react';
import { handleTaskBySVGMouseEvent } from '~/helpers/handleTaskBySVGMouseEvent';
import type { BarMoveAction } from '~/model/BarMoveAction';
import type { BarTask } from '~/model/BarTask';
import { Arrow } from '~/components/other/Arrow';
import { TaskItem } from '~/components/tasklist/TaskItem';
import type { GanttEvent } from '~/model/GanttEvent';
import { useEventOptions } from '~/helpers/hooks/useEventOptions';
import { useDisplayOptions } from '~/helpers/hooks/useDisplayOptions';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';
import type { OnGanttEventProps } from '~/model/OnGanttEventProps';

export const TaskGanttContent = (props: TaskGanttContentProps) => {
  const displayOptions = useDisplayOptions();
  const eventOptions = useEventOptions();
  const stylingOptions = useStylingOptions();

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
    const newXStep =
      (eventOptions.timeStep * stylingOptions.columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [stylingOptions.columnWidth, props.dates, eventOptions.timeStep]);

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
        eventOptions.timeStep,
        initEventX1Delta,
        displayOptions.rtl,
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
        eventOptions.timeStep,
        initEventX1Delta,
        displayOptions.rtl,
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
        eventOptions.onDateChange &&
        isNotLikeOriginal
      ) {
        try {
          const result = await eventOptions.onDateChange(
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
      } else if (eventOptions.onProgressChange && isNotLikeOriginal) {
        try {
          const result = await eventOptions.onProgressChange(
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
    eventOptions.onProgressChange,
    eventOptions.timeStep,
    eventOptions.onDateChange,
    props.svg,
    isMoving,
    point,
    displayOptions.rtl,
    props.setFailedTask,
    props.setGanttEvent,
  ]);

  /**
   * Method is Start point of task change
   */
  const handleBarEventStart = async (e: OnGanttEventProps) => {
    if (!e.action) {
      return;
    }

    if (e.action === 'select') {
      props.setSelectedTask(e.task.id);

      return;
    }

    if (e.action === 'delete') {
      if (!eventOptions.onDelete) {
        return;
      }

      try {
        const result = await eventOptions.onDelete(e.task);

        if (!result) {
          return;
        }

        props.setGanttEvent({ action: e.action, changedTask: e.task });
      } catch (error) {
        console.error('Error on Delete. ' + error);
      }

      return;
    }

    if (e.action === 'mouseenter') {
      if (props.ganttEvent.action) {
        return;
      }

      props.setGanttEvent({
        action: e.action,
        changedTask: e.task,
        originalSelectedTask: e.task,
      });

      return;
    }

    if (e.action === 'mouseleave') {
      if (props.ganttEvent.action !== 'mouseenter') {
        return;
      }

      props.setGanttEvent({ action: '' });

      return;
    }

    if (e.action === 'dblclick') {
      eventOptions.onDoubleClick?.(e.task);

      return;
    }

    if (e.action === 'click') {
      eventOptions.onClick?.(e.task);

      return;
    }

    // Change task event start
    if (e.action === 'move') {
      if (!props.svg?.current || !point) {
        return;
      }

      point.x = e.clientX || 0;

      const cursor = point.matrixTransform(
        props.svg.current.getScreenCTM()?.inverse(),
      );

      setInitEventX1Delta(cursor.x - e.task.x1);

      props.setGanttEvent({
        action: e.action,
        changedTask: e.task,
        originalSelectedTask: e.task,
      });

      return;
    }

    props.setGanttEvent({
      action: e.action,
      changedTask: e.task,
      originalSelectedTask: e.task,
    });
  };

  return (
    <g className="content">
      <g
        className="arrows"
        fill={stylingOptions.arrowColor}
        stroke={stylingOptions.arrowColor}
      >
        {props.tasks.map(task => {
          return task.barChildren.map(child => {
            return (
              <Arrow
                key={`Arrow from ${task.id} to ${props.tasks[child.index].id}`}
                taskFrom={task}
                taskTo={props.tasks[child.index]}
                taskHeight={props.taskHeight}
              />
            );
          });
        })}
      </g>
      <g className="bar">
        {props.tasks.map(task => {
          return (
            <TaskItem
              key={task.id}
              task={task}
              arrowIndent={stylingOptions.arrowIndent}
              taskHeight={props.taskHeight}
              isProgressChangeable={
                !!eventOptions.onProgressChange && !task.isDisabled
              }
              isDateChangeable={!!eventOptions.onDateChange && !task.isDisabled}
              isDelete={!task.isDisabled}
              onEventStart={handleBarEventStart}
              isSelected={
                !!props.selectedTask && task.id === props.selectedTask.id
              }
              rtl={displayOptions.rtl}
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
  readonly setSelectedTask: (taskId: string) => void;
  readonly svg?: RefObject<SVGSVGElement>;
  readonly svgWidth: number;
  readonly taskHeight: number;
  readonly setGanttEvent: (value: GanttEvent) => void;
  readonly setFailedTask: (value: BarTask | null) => void;
};
