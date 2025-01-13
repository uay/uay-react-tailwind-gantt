export const TaskListHeader = ({
                                 headerHeight,
                                 fontFamily,
                                 fontSize,
                                 rowWidth,
                               }: TaskListHeaderProps) => {
  return (
    <div
      className="table border-y border-l border-gray-200"
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <div
        className="table-row"
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          className="table-cell align-middle"
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;Name
        </div>
        <div
          className="border-r border-gray-300 opacity-100"
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className="table-cell align-middle"
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;From
        </div>
        <div
          className="border-r border-gray-300 opacity-100"
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className="table-cell align-middle"
          style={{
            minWidth: rowWidth,
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
  readonly fontFamily: string;
  readonly fontSize: string;
};
