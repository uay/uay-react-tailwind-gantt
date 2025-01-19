import type { KeyboardEventHandler, RefObject, SyntheticEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Task } from '~/model/public/Task';
import type { ViewMode } from '~/model/public/ViewMode';
import type { DateSetup } from '~/model/DateSetup';
import type { BarTask } from '~/model/BarTask';
import type { GanttEvent } from '~/model/GanttEvent';
import { convertToBarTasks } from '~/helpers/convertToBarTasks';
import { TaskList } from '~/components/tasklist/TaskList';
import { Tooltip } from '~/components/other/Tooltip';
import { VerticalScroll } from '~/components/other/VerticalScroll';
import { HorizontalScroll } from '~/components/other/HorizontalScroll';
import { TaskListHeader } from '~/components/tasklist/TaskListHeader';
import { TaskListTable } from '~/components/tasklist/TaskListTable';
import { Calendar } from '~/components/other/Calendar';
import { Grid } from '~/components/other/Grid';
import { Arrow } from '~/components/other/Arrow';
import { handleTaskBySVGMouseEvent } from '~/helpers/handleTaskBySVGMouseEvent';
import type { BarMoveAction } from '~/model/BarMoveAction';
import type { GanttContentMoveAction } from '~/model/GanttContentMoveAction';
import { TaskItem } from '~/components/tasklist/TaskItem';
import { ganttDateRange } from '~/helpers/date/ganttDateRange';
import { seedDates } from '~/helpers/date/seedDates';
import { removeHiddenTasks } from '~/helpers/removeHiddenTasks';
import { sortTasks } from '~/helpers/sortTasks';
import { isKeyboardEvent } from '~/helpers/isKeyboardEvent';
import type { ThemeOptions } from '~/model/public/ThemeOptions';
import { ThemeOptionsContext } from '~/context/ThemeOptionsContext';
import type { EventOptions } from '~/model/public/EventOptions';
import type { DisplayOptions } from '~/model/public/DisplayOptions';
import type { StylingOptions } from '~/model/public/StylingOptions';
import { DisplayOptionsContext } from '~/context/DisplayOptionsContext';
import { EventOptionsContext } from '~/context/EventOptionsContext';
import { StylingOptionsContext } from '~/context/StylingOptionsContext';
import { GanttStateContext } from '~/context/GanttStateContext';
import { useDisplayOptions } from '~/helpers/hooks/useDisplayOptions';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';
import { useGanttState } from '~/helpers/hooks/useGanttState';
import { useEventOptions } from '~/helpers/hooks/useEventOptions';

export const Gantt = (props: GanttProps) => {
  return (
    <DisplayOptionsContext.Provider value={props.displayOptions || {}}>
      <EventOptionsContext.Provider value={props.eventOptions || {}}>
        <StylingOptionsContext.Provider value={props.stylingOptions || {}}>
          <ThemeOptionsContext.Provider value={props.themeOptions || {}}>
            <GanttStateContext.Provider value={{ tasks: props.tasks }}>
              <GanttRoot />
            </GanttStateContext.Provider>
          </ThemeOptionsContext.Provider>
        </StylingOptionsContext.Provider>
      </EventOptionsContext.Provider>
    </DisplayOptionsContext.Provider>
  );
};

interface GanttProps {
  readonly tasks: Task[];
  readonly themeOptions?: Partial<ThemeOptions>;
  readonly eventOptions?: Partial<EventOptions>;
  readonly displayOptions?: Partial<DisplayOptions>;
  readonly stylingOptions?: Partial<StylingOptions>;
}

const GanttRoot = () => {
  const ganttState = useGanttState();
  const displayOptions = useDisplayOptions();
  const stylingOptions = useStylingOptions();
  const eventOptions = useEventOptions();

  const rtl = displayOptions.rtl;
  const locale = displayOptions.locale;
  const ganttHeight = stylingOptions.ganttHeight;
  const headerHeight = stylingOptions.headerHeight;
  const rowHeight = stylingOptions.rowHeight;
  const columnWidth = stylingOptions.columnWidth;
  const barFill = stylingOptions.barFill;

  const viewMode = displayOptions.viewMode;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const [startDate, endDate] = ganttDateRange(
      ganttState.tasks,
      viewMode,
      displayOptions.preStepsCount,
    );

    return {
      viewMode: viewMode,
      dates: seedDates(startDate, endDate, viewMode),
    };
  });
  const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(
    undefined,
  );

  const [taskListWidth, setTaskListWidth] = useState(0);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: '',
  });
  const taskHeight = useMemo(
    () => (rowHeight * barFill) / 100,
    [rowHeight, barFill],
  );

  const [selectedTask, setSelectedTask] = useState<BarTask>();
  const [failedTask, setFailedTask] = useState<BarTask | null>(null);

  const svgWidth = dateSetup.dates.length * columnWidth;
  const ganttFullHeight = barTasks.length * rowHeight;

  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(-1);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);

  // task change events
  useEffect(() => {
    let filteredTasks: Task[];
    if (eventOptions.onExpanderClick as unknown) {
      filteredTasks = removeHiddenTasks(ganttState.tasks);
    } else {
      filteredTasks = ganttState.tasks;
    }
    filteredTasks = filteredTasks.sort(sortTasks);
    const [startDate, endDate] = ganttDateRange(
      filteredTasks,
      viewMode,
      displayOptions.preStepsCount,
    );
    let newDates = seedDates(startDate, endDate, viewMode);
    if (rtl) {
      newDates = newDates.reverse();
      if (scrollX === -1) {
        setScrollX(newDates.length * columnWidth);
      }
    }
    setDateSetup({ dates: newDates, viewMode: viewMode });
    setBarTasks(
      convertToBarTasks(
        filteredTasks,
        newDates,
        columnWidth,
        rowHeight,
        taskHeight,
        stylingOptions.barCornerRadius,
        stylingOptions.handleWidth,
        rtl,
        stylingOptions.barProgressColor,
        stylingOptions.barProgressSelectedColor,
        stylingOptions.barBackgroundColor,
        stylingOptions.barBackgroundSelectedColor,
        stylingOptions.projectProgressColor,
        stylingOptions.projectProgressSelectedColor,
        stylingOptions.projectBackgroundColor,
        stylingOptions.projectBackgroundSelectedColor,
        stylingOptions.milestoneBackgroundColor,
        stylingOptions.milestoneBackgroundSelectedColor,
      ),
    );
  }, [
    ganttState,
    viewMode,
    displayOptions.preStepsCount,
    rowHeight,
    stylingOptions.barCornerRadius,
    columnWidth,
    taskHeight,
    stylingOptions.handleWidth,
    stylingOptions.barProgressColor,
    stylingOptions.barProgressSelectedColor,
    stylingOptions.barBackgroundColor,
    stylingOptions.barBackgroundSelectedColor,
    stylingOptions.projectProgressColor,
    stylingOptions.projectProgressSelectedColor,
    stylingOptions.projectBackgroundColor,
    stylingOptions.projectBackgroundSelectedColor,
    stylingOptions.milestoneBackgroundColor,
    stylingOptions.milestoneBackgroundSelectedColor,
    rtl,
    scrollX,
    eventOptions.onExpanderClick,
  ]);

  useEffect(() => {
    if (viewMode !== dateSetup.viewMode) {
      return;
    }

    const viewDate = displayOptions.viewDate;

    if (!viewDate) {
      return;
    }

    if (!currentViewDate || currentViewDate?.valueOf() !== viewDate.valueOf()) {
      const dates = dateSetup.dates;
      const index = dates.findIndex(
        (d, i) =>
          viewDate.valueOf() >= d.valueOf() &&
          i + 1 !== dates.length &&
          viewDate.valueOf() < dates[i + 1].valueOf(),
      );

      if (index === -1) {
        return;
      }

      setCurrentViewDate(viewDate);
      setScrollX(columnWidth * index);
    }
  }, [
    displayOptions.viewDate,
    columnWidth,
    dateSetup.dates,
    dateSetup.viewMode,
    viewMode,
    currentViewDate,
    setCurrentViewDate,
  ]);

  useEffect(() => {
    const { changedTask, action } = ganttEvent;
    if (changedTask) {
      if (action === 'delete') {
        setGanttEvent({ action: '' });
        setBarTasks(barTasks.filter(t => t.id !== changedTask.id));
      } else if (
        action === 'move' ||
        action === 'end' ||
        action === 'start' ||
        action === 'progress'
      ) {
        const prevStateTask = barTasks.find(t => t.id === changedTask.id);
        if (
          prevStateTask &&
          (prevStateTask.start.getTime() !== changedTask.start.getTime() ||
            prevStateTask.end.getTime() !== changedTask.end.getTime() ||
            prevStateTask.progress !== changedTask.progress)
        ) {
          // actions for change
          const newTaskList = barTasks.map(t =>
            t.id === changedTask.id ? changedTask : t,
          );
          setBarTasks(newTaskList);
        }
      }
    }
  }, [ganttEvent, barTasks]);

  useEffect(() => {
    if (failedTask) {
      setBarTasks(barTasks.map(t => (t.id !== failedTask.id ? t : failedTask)));
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);

  useEffect(() => {
    if (!stylingOptions.listCellWidth) {
      setTaskListWidth(0);
    }
    if (taskListRef.current) {
      setTaskListWidth(taskListRef.current.offsetWidth);
    }
  }, [taskListRef, stylingOptions.listCellWidth]);

  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
    }
  }, [wrapperRef, taskListWidth]);

  useEffect(() => {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight);
    } else {
      setSvgContainerHeight(ganttState.tasks.length * rowHeight + headerHeight);
    }
  }, [ganttHeight, ganttState, headerHeight, rowHeight]);

  // scroll events
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.shiftKey || event.deltaX) {
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
        let newScrollX = scrollX + scrollMove;
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
        setScrollX(newScrollX);
        event.preventDefault();
      } else if (ganttHeight) {
        let newScrollY = scrollY + event.deltaY;
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight;
        }
        if (newScrollY !== scrollY) {
          setScrollY(newScrollY);
          event.preventDefault();
        }
      }

      setIgnoreScrollEvent(true);
    };

    // subscribe if scroll is necessary
    wrapperRef.current?.addEventListener('wheel', handleWheel, {
      passive: false,
    });
    return () => {
      wrapperRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, [
    wrapperRef,
    scrollY,
    scrollX,
    ganttHeight,
    svgWidth,
    rtl,
    ganttFullHeight,
  ]);

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      setScrollY(event.currentTarget.scrollTop);
      setIgnoreScrollEvent(true);
    } else {
      setIgnoreScrollEvent(false);
    }
  };

  const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      setScrollX(event.currentTarget.scrollLeft);
      setIgnoreScrollEvent(true);
    } else {
      setIgnoreScrollEvent(false);
    }
  };

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
    let newScrollY = scrollY;
    let newScrollX = scrollX;
    let isX = true;
    switch (event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        newScrollY += rowHeight;
        isX = false;
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        newScrollY -= rowHeight;
        isX = false;
        break;
      case 'Left':
      case 'ArrowLeft':
        newScrollX -= columnWidth;
        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        newScrollX += columnWidth;
        break;
    }
    if (isX) {
      if (newScrollX < 0) {
        newScrollX = 0;
      } else if (newScrollX > svgWidth) {
        newScrollX = svgWidth;
      }
      setScrollX(newScrollX);
    } else {
      if (newScrollY < 0) {
        newScrollY = 0;
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        newScrollY = ganttFullHeight - ganttHeight;
      }
      setScrollY(newScrollY);
    }
    setIgnoreScrollEvent(true);
  };

  /**
   * Task select event
   */
  const handleSelectedTask = (taskId: string) => {
    const newSelectedTask = barTasks.find(t => t.id === taskId);
    const oldSelectedTask = barTasks.find(
      t => !!selectedTask && t.id === selectedTask.id,
    );
    if (eventOptions.onSelect) {
      if (oldSelectedTask) {
        eventOptions.onSelect(oldSelectedTask, false);
      }
      if (newSelectedTask) {
        eventOptions.onSelect(newSelectedTask, true);
      }
    }
    setSelectedTask(newSelectedTask);
  };
  const handleExpanderClick = (task: Task) => {
    if (eventOptions.onExpanderClick && task.hideChildren !== undefined) {
      eventOptions.onExpanderClick({
        ...task,
        hideChildren: !task.hideChildren,
      });
    }
  };

  return (
    <div>
      <div
        className="flex p-0 m-0 list-none outline-none relative"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
      >
        {stylingOptions.listCellWidth ? (
          <TaskList
            rowHeight={rowHeight}
            rowWidth={stylingOptions.listCellWidth}
            tasks={barTasks}
            locale={locale}
            headerHeight={headerHeight}
            scrollY={scrollY}
            ganttHeight={ganttHeight}
            horizontalContainerClass="overflow-hidden m-0 p-0"
            selectedTask={selectedTask}
            taskListRef={taskListRef}
            setSelectedTask={handleSelectedTask}
            onExpanderClick={handleExpanderClick}
            TaskListHeader={TaskListHeader}
            TaskListTable={TaskListTable}
          />
        ) : null}
        <TaskGantt
          gridProps={{
            columnWidth: columnWidth,
            svgWidth,
            tasks: ganttState.tasks,
            rowHeight: rowHeight,
            dates: dateSetup.dates,
            todayColor: stylingOptions.todayColor,
            rtl: rtl,
          }}
          calendarProps={{
            dateSetup,
            locale: locale,
            viewMode: viewMode,
            headerHeight: headerHeight,
            columnWidth: columnWidth,
            rtl: rtl,
          }}
          barProps={{
            tasks: barTasks,
            dates: dateSetup.dates,
            ganttEvent,
            selectedTask,
            rowHeight: rowHeight,
            taskHeight,
            columnWidth: columnWidth,
            arrowColor: stylingOptions.arrowColor,
            timeStep: eventOptions.timeStep,
            arrowIndent: stylingOptions.arrowIndent,
            svgWidth,
            rtl: rtl,
            setGanttEvent,
            setFailedTask,
            setSelectedTask: handleSelectedTask,
            onDateChange: eventOptions.onDateChange,
            onProgressChange: eventOptions.onProgressChange,
            onDoubleClick: eventOptions.onDoubleClick,
            onClick: eventOptions.onClick,
            onDelete: eventOptions.onDelete,
          }}
          ganttHeight={ganttHeight}
          scrollY={scrollY}
          scrollX={scrollX}
        />
        {ganttEvent.changedTask && (
          <Tooltip
            arrowIndent={stylingOptions.arrowIndent}
            rowHeight={rowHeight}
            svgContainerHeight={svgContainerHeight!}
            svgContainerWidth={svgContainerWidth}
            scrollX={scrollX}
            scrollY={scrollY}
            task={ganttEvent.changedTask}
            headerHeight={headerHeight}
            taskListWidth={taskListWidth}
            rtl={rtl}
            svgWidth={svgWidth}
          />
        )}
        <VerticalScroll
          ganttFullHeight={ganttFullHeight}
          ganttHeight={ganttHeight}
          headerHeight={headerHeight}
          scroll={scrollY}
          onScroll={handleScrollY}
          rtl={rtl}
        />
      </div>
      <HorizontalScroll
        svgWidth={svgWidth}
        taskListWidth={taskListWidth}
        scroll={scrollX}
        rtl={rtl}
        onScroll={handleScrollX}
      />
    </div>
  );
};

const TaskGantt = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
}: TaskGanttProps) => {
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

const TaskGanttContent = ({
  tasks,
  dates,
  ganttEvent,
  selectedTask,
  rowHeight,
  columnWidth,
  timeStep,
  svg,
  taskHeight,
  arrowColor,
  arrowIndent,
  rtl,
  setGanttEvent,
  setFailedTask,
  setSelectedTask,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
}: TaskGanttContentProps) => {
  const point = svg?.current?.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // create xStep
  useEffect(() => {
    const dateDelta =
      dates[1].getTime() -
      dates[0].getTime() -
      dates[1].getTimezoneOffset() * 60 * 1000 +
      dates[0].getTimezoneOffset() * 60 * 1000;
    const newXStep = (timeStep * columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!ganttEvent.changedTask || !point || !svg?.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse(),
      );

      const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        ganttEvent.action as BarMoveAction,
        ganttEvent.changedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl,
      );
      if (isChanged) {
        setGanttEvent({ action: ganttEvent.action, changedTask });
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {
      const { action, originalSelectedTask, changedTask } = ganttEvent;
      if (!changedTask || !point || !svg?.current || !originalSelectedTask)
        return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse(),
      );
      const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        action as BarMoveAction,
        changedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl,
      );

      const isNotLikeOriginal =
        originalSelectedTask.start !== newChangedTask.start ||
        originalSelectedTask.end !== newChangedTask.end ||
        originalSelectedTask.progress !== newChangedTask.progress;

      // remove listeners
      svg.current.removeEventListener('mousemove', handleMouseMove);
      svg.current.removeEventListener('mouseup', handleMouseUp);
      setGanttEvent({ action: '' });
      setIsMoving(false);

      // custom operation start
      let operationSuccess = true;
      if (
        (action === 'move' || action === 'end' || action === 'start') &&
        onDateChange &&
        isNotLikeOriginal
      ) {
        try {
          const result = await onDateChange(
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
      } else if (onProgressChange && isNotLikeOriginal) {
        try {
          const result = await onProgressChange(
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
        setFailedTask(originalSelectedTask);
      }
    };

    if (
      !isMoving &&
      (ganttEvent.action === 'move' ||
        ganttEvent.action === 'end' ||
        ganttEvent.action === 'start' ||
        ganttEvent.action === 'progress') &&
      svg?.current
    ) {
      svg.current.addEventListener('mousemove', handleMouseMove);
      svg.current.addEventListener('mouseup', handleMouseUp);
      setIsMoving(true);
    }
  }, [
    ganttEvent,
    xStep,
    initEventX1Delta,
    onProgressChange,
    timeStep,
    onDateChange,
    svg,
    isMoving,
    point,
    rtl,
    setFailedTask,
    setGanttEvent,
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
        setSelectedTask(task.id);
      }
    }
    // Keyboard events
    else if (isKeyboardEvent(event)) {
      if (action === 'delete') {
        if (onDelete) {
          try {
            const result = await onDelete(task);
            if (result !== undefined && result) {
              setGanttEvent({ action, changedTask: task });
            }
          } catch (error) {
            console.error('Error on Delete. ' + error);
          }
        }
      }
    }
    // Mouse Events
    else if (action === 'mouseenter') {
      if (!ganttEvent.action) {
        setGanttEvent({
          action,
          changedTask: task,
          originalSelectedTask: task,
        });
      }
    } else if (action === 'mouseleave') {
      if (ganttEvent.action === 'mouseenter') {
        setGanttEvent({ action: '' });
      }
    } else if (action === 'dblclick') {
      !!onDoubleClick && onDoubleClick(task);
    } else if (action === 'click') {
      !!onClick && onClick(task);
    }
    // Change task event start
    else if (action === 'move') {
      if (!svg?.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse(),
      );
      setInitEventX1Delta(cursor.x - task.x1);
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    } else {
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    }
  };

  return (
    <g className="content">
      <g className="arrows" fill={arrowColor} stroke={arrowColor}>
        {tasks.map(task => {
          return task.barChildren.map(child => {
            return (
              <Arrow
                key={`Arrow from ${task.id} to ${tasks[child.index].id}`}
                taskFrom={task}
                taskTo={tasks[child.index]}
                rowHeight={rowHeight}
                taskHeight={taskHeight}
                arrowIndent={arrowIndent}
                rtl={rtl}
              />
            );
          });
        })}
      </g>
      <g className="bar">
        {tasks.map(task => {
          return (
            <TaskItem
              task={task}
              arrowIndent={arrowIndent}
              taskHeight={taskHeight}
              isProgressChangeable={!!onProgressChange && !task.isDisabled}
              isDateChangeable={!!onDateChange && !task.isDisabled}
              isDelete={!task.isDisabled}
              onEventStart={handleBarEventStart as any} // FIXME: Type issue
              key={task.id}
              isSelected={!!selectedTask && task.id === selectedTask.id}
              rtl={rtl}
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
