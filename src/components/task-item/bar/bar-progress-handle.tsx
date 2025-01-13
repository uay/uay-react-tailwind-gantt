import React from 'react';

export const BarProgressHandle: React.FC<BarProgressHandleProps> = ({
  progressPoint,
  onMouseDown,
}) => {
  return (
    <polygon
      className="fill-gray-300 cursor-ew-resize opacity-0 invisible"
      points={progressPoint}
      onMouseDown={onMouseDown}
    />
  );
};

type BarProgressHandleProps = {
  progressPoint: string;
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
