export const TaskListHeader = (props: TaskListHeaderProps) => {
  return (
    <div className="table border-y border-l border-gray-200">
      <div
        className="table-row"
        style={{
          height: props.headerHeight - 2,
        }}
      >
        <div
          className="table-cell align-middle"
          style={{
            minWidth: props.rowWidth,
          }}
        >
          &nbsp;Name
        </div>
        <div
          className="border-r border-gray-300 opacity-100"
          style={{
            height: props.headerHeight * 0.5,
            marginTop: props.headerHeight * 0.2,
          }}
        />
        <div
          className="table-cell align-middle"
          style={{
            minWidth: props.rowWidth,
          }}
        >
          &nbsp;From
        </div>
        <div
          className="border-r border-gray-300 opacity-100"
          style={{
            height: props.headerHeight * 0.5,
            marginTop: props.headerHeight * 0.25,
          }}
        />
        <div
          className="table-cell align-middle"
          style={{
            minWidth: props.rowWidth,
          }}
        >
          &nbsp;To
        </div>
      </div>
    </div>
  );
};

type TaskListHeaderProps = {
  readonly headerHeight: number;
  readonly rowWidth: string;
};
