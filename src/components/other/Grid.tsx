import type { ReactNode } from 'react';
import type { Task } from '~/model/public/Task';
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

const GridBody = (props: GridBodyProps) => {
  let y = 0;
  const gridRows: ReactNode[] = [];
  const rowLines: ReactNode[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={props.svgWidth}
      y2={0}
      className="stroke-gray-200"
    />,
  ];

  for (const task of props.tasks) {
    gridRows.push(
      <rect
        key={'Row' + task.id}
        x="0"
        y={y}
        width={props.svgWidth}
        height={props.rowHeight}
        className={
          y % (2 * props.rowHeight) === 0 ? 'fill-white' : 'fill-gray-100'
        }
      />,
    );
    rowLines.push(
      <line
        key={'RowLine' + task.id}
        x="0"
        y1={y + props.rowHeight}
        x2={props.svgWidth}
        y2={y + props.rowHeight}
        className="stroke-gray-200"
      />,
    );
    y += props.rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactNode[] = [];
  let today: ReactNode = <rect />;
  for (let i = 0; i < props.dates.length; i++) {
    const date = props.dates[i];
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
      (i + 1 !== props.dates.length &&
        date.getTime() < now.getTime() &&
        props.dates[i + 1].getTime() >= now.getTime()) ||
      (i !== 0 &&
        i + 1 === props.dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - props.dates[i - 1].getTime(),
          'millisecond',
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect
          x={tickX}
          y={0}
          width={props.columnWidth}
          height={y}
          fill={props.todayColor}
        />
      );
    }

    if (
      props.rtl &&
      i + 1 !== props.dates.length &&
      date.getTime() >= now.getTime() &&
      props.dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + props.columnWidth}
          y={0}
          width={props.columnWidth}
          height={y}
          fill={props.todayColor}
        />
      );
    }
    tickX += props.columnWidth;
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
