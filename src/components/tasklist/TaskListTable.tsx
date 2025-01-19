import { useMemo } from 'react';
import type { Task } from '~/model/public/Task';

export const TaskListTable = ({
  rowHeight,
  rowWidth,
  tasks,
  fontSize,
  locale,
  onExpanderClick,
}: TaskListTableDefaultProps) => {
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale],
  );

  return (
    <div
      className="table border-l border-b border-gray-200"
      style={{
        fontSize: fontSize,
      }}
    >
      {tasks.map((t, idx) => {
        let expanderSymbol = '';
        if (t.hideChildren === false) {
          expanderSymbol = '▼';
        } else if (t.hideChildren === true) {
          expanderSymbol = '▶';
        }

        return (
          <div
            className={`table-row text-ellipsis ${
              idx % 2 === 0 ? 'bg-gray-100' : ''
            }`}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={t.name}
            >
              <div className="flex">
                <div
                  className={`${
                    expanderSymbol
                      ? 'text-gray-600 text-xs px-1 py-1 cursor-pointer select-none'
                      : 'text-xs pl-4 select-none'
                  }`}
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol}
                </div>
                <div>{t.name}</div>
              </div>
            </div>
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
            </div>
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
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
  readonly fontSize: string;
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
