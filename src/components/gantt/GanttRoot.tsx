import { useGanttState } from '~/helpers/hooks/useGanttState';
import { useDisplayOptions } from '~/helpers/hooks/useDisplayOptions';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';
import { useEventOptions } from '~/helpers/hooks/useEventOptions';
import {
  type KeyboardEventHandler,
  type SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { DateSetup } from '~/model/DateSetup';
import { ganttDateRange } from '~/helpers/date/ganttDateRange';
import { seedDates } from '~/helpers/date/seedDates';
import type { BarTask } from '~/model/BarTask';
import type { GanttEvent } from '~/model/GanttEvent';
import type { Task } from '~/model/public/Task';
import { removeHiddenTasks } from '~/helpers/removeHiddenTasks';
import { sortTasks } from '~/helpers/sortTasks';
import { convertToBarTasks } from '~/helpers/convertToBarTasks';
import { TaskList } from '~/components/tasklist/TaskList';
import { TaskListHeader } from '~/components/tasklist/TaskListHeader';
import { TaskListTable } from '~/components/tasklist/TaskListTable';
import { Tooltip } from '~/components/other/Tooltip';
import { VerticalScroll } from '~/components/other/VerticalScroll';
import { HorizontalScroll } from '~/components/other/HorizontalScroll';
import { TaskGantt } from '~/components/gantt/TaskGantt';

export const GanttRoot = () => {
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
