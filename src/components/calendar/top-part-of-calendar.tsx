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
    <g className="calendarTop">
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
  value: string;
  x1Line: number;
  y1Line: number;
  y2Line: number;
  xText: number;
  yText: number;
};
