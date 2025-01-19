import type { ReactNode } from 'react';
import { ViewMode } from '~/model/public/ViewMode';
import { getLocaleMonth } from '~/helpers/date/getLocaleMonth';
import { getWeekNumberISO8601 } from '~/helpers/date/getWeekNumberISO8601';
import { getLocalDayOfWeek } from '~/helpers/date/getLocalDayOfWeek';
import { getDaysInMonth } from '~/helpers/date/getDaysInMonth';
import { getCachedDateTimeFormat } from '~/helpers/date/getCachedDateTimeFormat';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';
import { useDisplayOptions } from '~/helpers/hooks/useDisplayOptions';

export const Calendar = (props: CalendarProps) => {
  const display = useDisplayOptions();
  const styling = useStylingOptions();

  const getCalendarValuesForYear = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const topDefaultHeight = styling.headerHeight * 0.5;

    for (let i = 0; i < props.dates.length; i++) {
      const date = props.dates[i];
      const bottomValue = date.getFullYear();

      bottomValues.push(
        <text
          key={date.getTime()}
          y={styling.headerHeight * 0.8}
          x={styling.columnWidth * i + styling.columnWidth * 0.5}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );

      if (i === 0 || date.getFullYear() !== props.dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (display.rtl) {
          xText = (6 + i + date.getFullYear() + 1) * styling.columnWidth;
        } else {
          xText = (6 + i - date.getFullYear()) * styling.columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={styling.columnWidth * i}
            y1Line={0}
            y2Line={styling.headerHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForQuarterYear = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const topDefaultHeight = styling.headerHeight * 0.5;

    for (let i = 0; i < props.dates.length; i++) {
      const date = props.dates[i];
      const quarter = 'Q' + Math.floor((date.getMonth() + 3) / 3);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={styling.headerHeight * 0.8}
          x={styling.columnWidth * i + styling.columnWidth * 0.5}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {quarter}
        </text>,
      );

      if (i === 0 || date.getFullYear() !== props.dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (display.rtl) {
          xText = (6 + i + date.getMonth() + 1) * styling.columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * styling.columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={styling.columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={Math.abs(xText)}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForMonth = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const topDefaultHeight = styling.headerHeight * 0.5;

    for (let i = 0; i < props.dates.length; i++) {
      const date = props.dates[i];
      const bottomValue = getLocaleMonth(date, display.locale);

      bottomValues.push(
        <text
          key={bottomValue + date.getFullYear()}
          y={styling.headerHeight * 0.8}
          x={styling.columnWidth * i + styling.columnWidth * 0.5}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );

      if (i === 0 || date.getFullYear() !== props.dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (display.rtl) {
          xText = (6 + i + date.getMonth() + 1) * styling.columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * styling.columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={styling.columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    let weeksCount = 1;
    const topDefaultHeight = styling.headerHeight * 0.5;
    const dates = props.dates;

    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = '';

      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        topValue = `${getLocaleMonth(date, display.locale)}, ${date.getFullYear()}`;
      }

      const bottomValue = `W${getWeekNumberISO8601(date)}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={styling.headerHeight * 0.8}
          x={styling.columnWidth * (i + +display.rtl)}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );

      if (topValue) {
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
              value={topValue}
              x1Line={
                styling.columnWidth * i + weeksCount * styling.columnWidth
              }
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={
                styling.columnWidth * i + styling.columnWidth * weeksCount * 0.5
              }
              yText={topDefaultHeight * 0.9}
            />,
          );
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const topDefaultHeight = styling.headerHeight * 0.5;
    const dates = props.dates;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = `${getLocalDayOfWeek(
        date,
        display.locale,
        'short',
      )}, ${date.getDate()}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={styling.headerHeight * 0.8}
          x={styling.columnWidth * i + styling.columnWidth * 0.5}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );

      if (
        i + 1 !== dates.length &&
        date.getMonth() !== dates[i + 1].getMonth()
      ) {
        const topValue = getLocaleMonth(date, display.locale);

        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={styling.columnWidth * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              styling.columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), date.getFullYear()) *
                styling.columnWidth *
                0.5
            }
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const ticks = display.viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = styling.headerHeight * 0.5;
    const dates = props.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(display.locale, {
        hour: 'numeric',
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={styling.headerHeight * 0.8}
          x={styling.columnWidth * (i + +display.rtl)}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );
      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        const topValue = `${getLocalDayOfWeek(
          date,
          display.locale,
          'short',
        )}, ${date.getDate()} ${getLocaleMonth(date, display.locale)}`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={styling.columnWidth * i + ticks * styling.columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={styling.columnWidth * i + ticks * styling.columnWidth * 0.5}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const topDefaultHeight = styling.headerHeight * 0.5;
    const dates = props.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(display.locale, {
        hour: 'numeric',
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={styling.headerHeight * 0.8}
          x={styling.columnWidth * (i + +display.rtl)}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );
      if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
        const displayDate = dates[i - 1];
        const topValue = `${getLocalDayOfWeek(
          displayDate,
          display.locale,
          'long',
        )}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, display.locale)}`;
        const topPosition = (date.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + displayDate.getFullYear()}
            value={topValue}
            x1Line={styling.columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={styling.columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }

    return [topValues, bottomValues];
  };

  let topValues: ReactNode[] = [];
  let bottomValues: ReactNode[] = [];
  switch (display.viewMode) {
    case ViewMode.Year:
      [topValues, bottomValues] = getCalendarValuesForYear();
      break;
    case ViewMode.QuarterYear:
      [topValues, bottomValues] = getCalendarValuesForQuarterYear();
      break;
    case ViewMode.Month:
      [topValues, bottomValues] = getCalendarValuesForMonth();
      break;
    case ViewMode.Week:
      [topValues, bottomValues] = getCalendarValuesForWeek();
      break;
    case ViewMode.Day:
      [topValues, bottomValues] = getCalendarValuesForDay();
      break;
    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      [topValues, bottomValues] = getCalendarValuesForPartOfDay();
      break;
    case ViewMode.Hour:
      [topValues, bottomValues] = getCalendarValuesForHour();
  }
  return (
    <g className="calendar">
      <rect
        x={0}
        y={0}
        width={styling.columnWidth * props.dates.length}
        height={styling.headerHeight}
        className="bg-white stroke-gray-300 stroke-[1.4]"
      />
      {bottomValues} {topValues}
    </g>
  );
};

type CalendarProps = {
  readonly dates: Date[];
};

const TopPartOfCalendar = (props: TopPartOfCalendarProps) => {
  return (
    <g>
      <line
        x1={props.x1Line}
        y1={props.y1Line}
        x2={props.x1Line}
        y2={props.y2Line}
        className="stroke-gray-200"
        key={props.value + 'line'}
      />
      <text
        key={props.value + 'text'}
        y={props.yText}
        x={props.xText}
        className="fill-gray-200"
      >
        {props.value}
      </text>
    </g>
  );
};

type TopPartOfCalendarProps = {
  readonly value: string;
  readonly x1Line: number;
  readonly y1Line: number;
  readonly y2Line: number;
  readonly xText: number;
  readonly yText: number;
};
