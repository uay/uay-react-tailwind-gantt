import type { ReactNode } from 'react';
import type { Task } from '~/model/public/Task';
import { addToDate } from '~/helpers/date/addToDate';
import { useDisplayOptions } from '~/helpers/hooks/useDisplayOptions';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';

export const Grid = (props: GridProps) => {
  const display = useDisplayOptions();
  const styling = useStylingOptions();

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
        height={styling.rowHeight}
        className={
          y % (2 * styling.rowHeight) === 0 ? 'fill-white' : 'fill-gray-100'
        }
      />,
    );
    rowLines.push(
      <line
        key={'RowLine' + task.id}
        x="0"
        y1={y + styling.rowHeight}
        x2={props.svgWidth}
        y2={y + styling.rowHeight}
        className="stroke-gray-200"
      />,
    );
    y += styling.rowHeight;
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
          width={styling.columnWidth}
          height={y}
          fill={styling.todayColor}
        />
      );
    }

    if (
      display.rtl &&
      i + 1 !== props.dates.length &&
      date.getTime() >= now.getTime() &&
      props.dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + styling.columnWidth}
          y={0}
          width={styling.columnWidth}
          height={y}
          fill={styling.todayColor}
        />
      );
    }
    tickX += styling.columnWidth;
  }

  return (
    <g className="grid">
      <g className="gridBody">
        <g className="rows">{gridRows}</g>
        <g className="rowLines">{rowLines}</g>
        <g className="ticks">{ticks}</g>
        <g className="today">{today}</g>
      </g>
    </g>
  );
};

type GridProps = {
  readonly tasks: Task[];
  readonly dates: Date[];
  readonly svgWidth: number;
};
