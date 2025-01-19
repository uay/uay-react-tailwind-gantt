import { useMemo } from 'react';
import type { Task } from '~/model/public/Task';
import { useDisplayOptions } from '~/helpers/hooks/useDisplayOptions';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';

export const TaskListTable = (props: TaskListTableDefaultProps) => {
  const displayOptions = useDisplayOptions();
  const stylingOptions = useStylingOptions();

  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(displayOptions.locale),
    [displayOptions.locale],
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
            style={{ height: stylingOptions.rowHeight }}
            key={`${task.id}row`}
          >
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: stylingOptions.listCellWidth,
                maxWidth: stylingOptions.listCellWidth,
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
                minWidth: stylingOptions.listCellWidth,
                maxWidth: stylingOptions.listCellWidth,
              }}
            >
              &nbsp;{toLocaleDateString(task.start, dateTimeOptions)}
            </div>
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: stylingOptions.listCellWidth,
                maxWidth: stylingOptions.listCellWidth,
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
