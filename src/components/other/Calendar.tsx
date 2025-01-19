import type { ReactNode } from 'react';
import { ViewMode } from '~/model/public/ViewMode';
import type { DateSetup } from '~/model/DateSetup';
import { getLocaleMonth } from '~/helpers/date/getLocaleMonth';
import { getWeekNumberISO8601 } from '~/helpers/date/getWeekNumberISO8601';
import { getLocalDayOfWeek } from '~/helpers/date/getLocalDayOfWeek';
import { getDaysInMonth } from '~/helpers/date/getDaysInMonth';
import { getCachedDateTimeFormat } from '~/helpers/date/getCachedDateTimeFormat';

export const Calendar = (props: CalendarProps) => {
  const getCalendarValuesForYear = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const topDefaultHeight = props.headerHeight * 0.5;

    for (let i = 0; i < props.dateSetup.dates.length; i++) {
      const date = props.dateSetup.dates[i];
      const bottomValue = date.getFullYear();

      bottomValues.push(
        <text
          key={date.getTime()}
          y={props.headerHeight * 0.8}
          x={props.columnWidth * i + props.columnWidth * 0.5}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );

      if (
        i === 0 ||
        date.getFullYear() !== props.dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (props.rtl) {
          xText = (6 + i + date.getFullYear() + 1) * props.columnWidth;
        } else {
          xText = (6 + i - date.getFullYear()) * props.columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={props.columnWidth * i}
            y1Line={0}
            y2Line={props.headerHeight}
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
    const topDefaultHeight = props.headerHeight * 0.5;

    for (let i = 0; i < props.dateSetup.dates.length; i++) {
      const date = props.dateSetup.dates[i];
      const quarter = 'Q' + Math.floor((date.getMonth() + 3) / 3);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={props.headerHeight * 0.8}
          x={props.columnWidth * i + props.columnWidth * 0.5}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {quarter}
        </text>,
      );

      if (
        i === 0 ||
        date.getFullYear() !== props.dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (props.rtl) {
          xText = (6 + i + date.getMonth() + 1) * props.columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * props.columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={props.columnWidth * i}
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
    const topDefaultHeight = props.headerHeight * 0.5;

    for (let i = 0; i < props.dateSetup.dates.length; i++) {
      const date = props.dateSetup.dates[i];
      const bottomValue = getLocaleMonth(date, props.locale);

      bottomValues.push(
        <text
          key={bottomValue + date.getFullYear()}
          y={props.headerHeight * 0.8}
          x={props.columnWidth * i + props.columnWidth * 0.5}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );

      if (
        i === 0 ||
        date.getFullYear() !== props.dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (props.rtl) {
          xText = (6 + i + date.getMonth() + 1) * props.columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * props.columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={props.columnWidth * i}
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
    const topDefaultHeight = props.headerHeight * 0.5;
    const dates = props.dateSetup.dates;

    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = '';

      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        topValue = `${getLocaleMonth(date, props.locale)}, ${date.getFullYear()}`;
      }

      const bottomValue = `W${getWeekNumberISO8601(date)}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={props.headerHeight * 0.8}
          x={props.columnWidth * (i + +props.rtl)}
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
              x1Line={props.columnWidth * i + weeksCount * props.columnWidth}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={
                props.columnWidth * i + props.columnWidth * weeksCount * 0.5
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
    const topDefaultHeight = props.headerHeight * 0.5;
    const dates = props.dateSetup.dates;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = `${getLocalDayOfWeek(
        date,
        props.locale,
        'short',
      )}, ${date.getDate()}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={props.headerHeight * 0.8}
          x={props.columnWidth * i + props.columnWidth * 0.5}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );

      if (
        i + 1 !== dates.length &&
        date.getMonth() !== dates[i + 1].getMonth()
      ) {
        const topValue = getLocaleMonth(date, props.locale);

        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={props.columnWidth * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              props.columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), date.getFullYear()) *
                props.columnWidth *
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
    const ticks = props.viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = props.headerHeight * 0.5;
    const dates = props.dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(props.locale, {
        hour: 'numeric',
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={props.headerHeight * 0.8}
          x={props.columnWidth * (i + +props.rtl)}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );
      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        const topValue = `${getLocalDayOfWeek(
          date,
          props.locale,
          'short',
        )}, ${date.getDate()} ${getLocaleMonth(date, props.locale)}`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={props.columnWidth * i + ticks * props.columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={props.columnWidth * i + ticks * props.columnWidth * 0.5}
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
    const topDefaultHeight = props.headerHeight * 0.5;
    const dates = props.dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(props.locale, {
        hour: 'numeric',
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={props.headerHeight * 0.8}
          x={props.columnWidth * (i + +props.rtl)}
          className="text-center text-gray-800 select-none pointer-events-none"
        >
          {bottomValue}
        </text>,
      );
      if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
        const displayDate = dates[i - 1];
        const topValue = `${getLocalDayOfWeek(
          displayDate,
          props.locale,
          'long',
        )}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, props.locale)}`;
        const topPosition = (date.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + displayDate.getFullYear()}
            value={topValue}
            x1Line={props.columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={props.columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }

    return [topValues, bottomValues];
  };

  let topValues: ReactNode[] = [];
  let bottomValues: ReactNode[] = [];
  switch (props.dateSetup.viewMode) {
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
        width={props.columnWidth * props.dateSetup.dates.length}
        height={props.headerHeight}
        className="bg-white stroke-gray-300 stroke-[1.4]"
      />
      {bottomValues} {topValues}
    </g>
  );
};

type CalendarProps = {
  readonly dateSetup: DateSetup;
  readonly locale: string;
  readonly viewMode: ViewMode;
  readonly rtl: boolean;
  readonly headerHeight: number;
  readonly columnWidth: number;
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
