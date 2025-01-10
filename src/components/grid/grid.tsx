import React from 'react';
import { GridBody, GridBodyProps } from './grid-body';

type GridProps = GridBodyProps;
export const Grid: React.FC<GridProps> = props => {
  return (
    <g className="grid">
      <GridBody {...props} />
    </g>
  );
};
