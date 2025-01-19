import { type RefObject, useEffect, useRef } from 'react';
import { Calendar } from '~/components/other/Calendar';
import { Grid } from '~/components/other/Grid';
import type { Task } from '~/model/public/Task';
import type { DateSetup } from '~/model/DateSetup';
import type { ViewMode } from '~/model/public/ViewMode';
import type { BarTask } from '~/model/BarTask';
import type { GanttEvent } from '~/model/GanttEvent';
import type { EventOptions } from '~/model/public/EventOptions';
import { TaskGanttContent } from '~/components/gantt/TaskGanttContent';

export const TaskGantt = (props: TaskGanttProps) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...props.barProps, svg: ganttSVGRef };

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
        height={props.calendarProps.headerHeight}
      >
        <Calendar {...props.calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className="overflow-hidden text-0 m-0 p-0"
        style={
          props.ganttHeight
            ? { height: props.ganttHeight, width: props.gridProps.svgWidth }
            : { width: props.gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={props.gridProps.svgWidth}
          height={props.barProps.rowHeight * props.barProps.tasks.length}
          ref={ganttSVGRef}
        >
          <Grid {...props.gridProps} />
          <TaskGanttContent {...newBarProps} />
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
    readonly rowHeight: number;
    readonly columnWidth: number;
    readonly todayColor: string;
    readonly rtl: boolean;
  };
  readonly calendarProps: {
    readonly dateSetup: DateSetup;
    readonly locale: string;
    readonly viewMode: ViewMode;
    readonly rtl: boolean;
    readonly headerHeight: number;
    readonly columnWidth: number;
  };
  readonly barProps: {
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
  readonly ganttHeight: number;
  readonly scrollY: number;
  readonly scrollX: number;
};
