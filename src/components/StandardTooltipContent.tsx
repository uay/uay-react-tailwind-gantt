import React from 'react';
import { Task } from '../model/Task';

export const StandardTooltipContent: React.FC<StandardTooltipContentProps> = ({
  task,
  fontSize,
  fontFamily,
}) => {
  return (
    <div className="bg-white p-3 shadow-md" style={{ fontSize, fontFamily }}>
      <b
        style={{ fontSize: parseInt(fontSize) + 6 }}
      >{`${task.name}: ${task.start.getDate()}-${
        task.start.getMonth() + 1
      }-${task.start.getFullYear()} - ${task.end.getDate()}-${
        task.end.getMonth() + 1
      }-${task.end.getFullYear()}`}</b>
      {task.end.getTime() - task.start.getTime() !== 0 && (
        <p className="text-sm mb-1 text-gray-600">{`Duration: ${~~(
          (task.end.getTime() - task.start.getTime()) /
          (1000 * 60 * 60 * 24)
        )} day(s)`}</p>
      )}
      <p className="text-sm text-gray-600">
        {!!task.progress && `Progress: ${task.progress} %`}
      </p>
    </div>
  );
};

type StandardTooltipContentProps = {
  readonly task: Task;
  readonly fontSize: string;
  readonly fontFamily: string;
};
