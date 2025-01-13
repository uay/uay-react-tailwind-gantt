import React from 'react';
import { GridBody } from './grid-body';
import { Task } from '../../types/public-types';

type GridProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
};

export const Grid: React.FC<GridProps> = props => {
  return (
    <g className="grid">
      <GridBody {...props} />
    </g>
  );
};
