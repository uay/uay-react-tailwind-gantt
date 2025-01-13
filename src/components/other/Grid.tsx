import type { ReactNode } from 'react';
import type { Task } from '~/model/Task';
import { addToDate } from '~/helpers/date/addToDate';

export const Grid = (props: GridProps) => {
  return (
    <g className="grid">
      <GridBody {...props} />
    </g>
  );
};

type GridProps = {
  readonly tasks: Task[];
  readonly dates: Date[];
  readonly svgWidth: number;
  readonly rowHeight: number;
  readonly columnWidth: number;
  readonly todayColor: string;
  readonly rtl: boolean;
};

const GridBody = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl,
}: GridBodyProps) => {
  let y = 0;
  const gridRows: ReactNode[] = [];
  const rowLines: ReactNode[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className="stroke-gray-200"
    />,
  ];

  for (const task of tasks) {
    gridRows.push(
      <rect
        key={'Row' + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={y % (2 * rowHeight) === 0 ? 'fill-white' : 'fill-gray-100'}
      />,
    );
    rowLines.push(
      <line
        key={'RowLine' + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className="stroke-gray-200"
      />,
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactNode[] = [];
  let today: ReactNode = <rect />;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className="stroke-gray-300"
      />,
    );

    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          'millisecond',
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    tickX += columnWidth;
  }

  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today">{today}</g>
    </g>
  );
};

type GridBodyProps = {
  readonly tasks: Task[];
  readonly dates: Date[];
  readonly svgWidth: number;
  readonly rowHeight: number;
  readonly columnWidth: number;
  readonly todayColor: string;
  readonly rtl: boolean;
};
