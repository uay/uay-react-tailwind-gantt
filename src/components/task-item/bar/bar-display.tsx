import React from 'react';

export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  isSelected,
  progressX,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
}) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className="select-none stroke-0"
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
      />
    </g>
  );
};

type BarDisplayProps = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly isSelected: boolean;
  /* progress start point */
  readonly progressX: number;
  readonly progressWidth: number;
  readonly barCornerRadius: number;
  readonly styles: {
    readonly backgroundColor: string;
    readonly backgroundSelectedColor: string;
    readonly progressColor: string;
    readonly progressSelectedColor: string;
  };
  readonly onMouseDown: (
    event: React.MouseEvent<SVGPolygonElement, MouseEvent>,
  ) => void;
};
