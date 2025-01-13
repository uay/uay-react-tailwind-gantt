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
  gridProps: {
    tasks: Task[];
    dates: Date[];
    svgWidth: number;
    rowHeight: number;
    columnWidth: number;
    todayColor: string;
    rtl: boolean;
  };
  calendarProps: {
    dateSetup: DateSetup;
    locale: string;
    viewMode: ViewMode;
    rtl: boolean;
    headerHeight: number;
    columnWidth: number;
    fontFamily: string;
    fontSize: string;
  };
  barProps: {
    tasks: BarTask[];
    dates: Date[];
    ganttEvent: GanttEvent;
    selectedTask: BarTask | undefined;
    rowHeight: number;
    columnWidth: number;
    timeStep: number;
    svg?: React.RefObject<SVGSVGElement>;
    svgWidth: number;
    taskHeight: number;
    arrowColor: string;
    arrowIndent: number;
    fontSize: string;
    fontFamily: string;
    rtl: boolean;
    setGanttEvent: (value: GanttEvent) => void;
    setFailedTask: (value: BarTask | null) => void;
    setSelectedTask: (taskId: string) => void;
  } & EventOption;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
};
