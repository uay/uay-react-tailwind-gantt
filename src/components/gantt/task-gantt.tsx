import React, { useRef, useEffect } from 'react';
import { Grid } from '../grid/grid';
import { Calendar } from '../calendar/calendar';
import { TaskGanttContent } from './task-gantt-content';
import { EventOption, Task, ViewMode } from '../../types/public-types';
import { DateSetup } from '../../types/date-setup';
import { BarTask } from '../../types/bar-task';
import { GanttEvent } from '../../types/gantt-task-actions';

export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };

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
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight}
        fontFamily={barProps.fontFamily}
      >
        <Calendar {...calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className="overflow-hidden text-0 m-0 p-0"
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={barProps.rowHeight * barProps.tasks.length}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} />
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
    readonly fontFamily: string;
    readonly fontSize: string;
  };
  readonly barProps: {
    readonly tasks: BarTask[];
    readonly dates: Date[];
    readonly ganttEvent: GanttEvent;
    readonly selectedTask: BarTask | undefined;
    readonly rowHeight: number;
    readonly columnWidth: number;
    readonly timeStep: number;
    readonly svg?: React.RefObject<SVGSVGElement>;
    readonly svgWidth: number;
    readonly taskHeight: number;
    readonly arrowColor: string;
    readonly arrowIndent: number;
    readonly fontSize: string;
    readonly fontFamily: string;
    readonly rtl: boolean;
    readonly setGanttEvent: (value: GanttEvent) => void;
    readonly setFailedTask: (value: BarTask | null) => void;
    readonly setSelectedTask: (taskId: string) => void;
  } & EventOption;
  readonly ganttHeight: number;
  readonly scrollY: number;
  readonly scrollX: number;
};
