import { type RefObject, useEffect, useRef } from 'react';
import { Calendar } from '~/components/other/Calendar';
import { Grid } from '~/components/other/Grid';
import type { Task } from '~/model/public/Task';
import type { DateSetup } from '~/model/DateSetup';
import type { BarTask } from '~/model/BarTask';
import type { GanttEvent } from '~/model/GanttEvent';
import { TaskGanttContent } from '~/components/gantt/TaskGanttContent';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';

export const TaskGantt = (props: TaskGanttProps) => {
  const styling = useStylingOptions();

  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  return (
    <div
      className="overflow-hidden text-0 m-0 p-0"
      ref={verticalGanttContainerRef}
      dir="ltr"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.gridProps.svgWidth}
        height={styling.headerHeight}
      >
        <Calendar {...props.calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className="overflow-hidden text-0 m-0 p-0"
        style={
          styling.ganttHeight
            ? { height: styling.ganttHeight, width: props.gridProps.svgWidth }
            : { width: props.gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={props.gridProps.svgWidth}
          height={styling.rowHeight * props.barProps.tasks.length}
          ref={ganttSVGRef}
        >
          <Grid
            tasks={props.gridProps.tasks}
            dates={props.gridProps.dates}
            svgWidth={props.gridProps.svgWidth}
          />
          <TaskGanttContent
            tasks={props.barProps.tasks}
            dates={props.barProps.dates}
            ganttEvent={props.barProps.ganttEvent}
            selectedTask={props.barProps.selectedTask}
            setSelectedTask={props.barProps.setSelectedTask}
            svg={ganttSVGRef}
            svgWidth={props.barProps.svgWidth}
            taskHeight={props.barProps.taskHeight}
            setGanttEvent={props.barProps.setGanttEvent}
            setFailedTask={props.barProps.setFailedTask}
          />
        </svg>
      </div>
    </div>
  );
};

type TaskGanttProps = {
  readonly gridProps: {
    readonly tasks: Task[];
    readonly dates: Date[];
    readonly svgWidth: number;
  };
  readonly calendarProps: {
    readonly dateSetup: DateSetup;
  };
  readonly barProps: {
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
  readonly scrollY: number;
  readonly scrollX: number;
};
