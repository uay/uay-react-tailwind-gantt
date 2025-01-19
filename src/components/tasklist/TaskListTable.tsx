import { useMemo } from 'react';
import type { Task } from '~/model/public/Task';

export const TaskListTable = (props: TaskListTableDefaultProps) => {
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(props.locale),
    [props.locale],
  );

  return (
    <div className="table border-l border-b border-gray-200">
      {props.tasks.map((task, idx) => {
        let expanderSymbol = '';
        if (task.hideChildren === false) {
          expanderSymbol = '▼';
        } else if (task.hideChildren === true) {
          expanderSymbol = '▶';
        }

        return (
          <div
            className={`table-row text-ellipsis ${
              idx % 2 === 0 ? 'bg-gray-100' : ''
            }`}
            style={{ height: props.rowHeight }}
            key={`${task.id}row`}
          >
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: props.rowWidth,
                maxWidth: props.rowWidth,
              }}
              title={task.name}
            >
              <div className="flex">
                <div
                  className={`${
                    expanderSymbol
                      ? 'text-gray-600 text-xs px-1 py-1 cursor-pointer select-none'
                      : 'text-xs pl-4 select-none'
                  }`}
                  onClick={() => props.onExpanderClick(task)}
                >
                  {expanderSymbol}
                </div>
                <div>{task.name}</div>
              </div>
            </div>
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: props.rowWidth,
                maxWidth: props.rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(task.start, dateTimeOptions)}
            </div>
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: props.rowWidth,
                maxWidth: props.rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(task.end, dateTimeOptions)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

type TaskListTableDefaultProps = {
  readonly rowHeight: number;
  readonly rowWidth: string;
  readonly locale: string;
  readonly tasks: Task[];
  readonly selectedTaskId: string;
  readonly setSelectedTask: (taskId: string) => void;
  readonly onExpanderClick: (task: Task) => void;
};

const localeDateStringCache: Record<string, string> = {};
const toLocaleDateStringFactory =
  (locale: string) =>
  (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
    const key = date.toString();
    let lds = localeDateStringCache[key];

    if (!lds) {
      lds = date.toLocaleDateString(locale, dateTimeOptions);
      localeDateStringCache[key] = lds;
    }

    return lds;
  };

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
