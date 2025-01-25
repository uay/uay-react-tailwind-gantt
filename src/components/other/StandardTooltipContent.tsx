import type { Task } from '~/model/public/Task';

export const StandardTooltipContent = (props: StandardTooltipContentProps) => {
  return (
    <div className="bg-white p-3 shadow-md">
      <b>{`${props.task.name}: ${props.task.start.getDate()}-${
        props.task.start.getMonth() + 1
      }-${props.task.start.getFullYear()} - ${props.task.end.getDate()}-${
        props.task.end.getMonth() + 1
      }-${props.task.end.getFullYear()}`}</b>
      {props.task.end.getTime() - props.task.start.getTime() !== 0 && (
        <p className="text-sm mb-1 text-gray-600">{`Duration: ${~~(
          (props.task.end.getTime() - props.task.start.getTime()) /
          (1000 * 60 * 60 * 24)
        )} day(s)`}</p>
      )}
      <p className="text-sm text-gray-600">
        {!!props.task.progress && `Progress: ${props.task.progress} %`}
      </p>
    </div>
  );
};

type StandardTooltipContentProps = {
  readonly task: Task;
};
