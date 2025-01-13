import React from 'react';

export const TopPartOfCalendar: React.FC<TopPartOfCalendarProps> = ({
  value,
  x1Line,
  y1Line,
  y2Line,
  xText,
  yText,
}) => {
  return (
    <g>
      <line
        x1={x1Line}
        y1={y1Line}
        x2={x1Line}
        y2={y2Line}
        className="stroke-gray-200"
        key={value + 'line'}
      />
      <text
        key={value + 'text'}
        y={yText}
        x={xText}
        className="stroke-gray-200"
      >
        {value}
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
