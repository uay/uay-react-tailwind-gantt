import React from 'react';

export const BarDateHandle: React.FC<BarDateHandleProps> = ({
  x,
  y,
  width,
  height,
  barCornerRadius,
  onMouseDown,
}) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      className="fill-gray-300 cursor-ew-resize opacity-0 invisible"
      ry={barCornerRadius}
      rx={barCornerRadius}
      onMouseDown={onMouseDown}
    />
  );
};

type BarDateHandleProps = {
 readonly x: number;
 readonly y: number;
 readonly width: number;
 readonly height: number;
 readonly barCornerRadius: number;
 readonly onMouseDown: (event: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
};
