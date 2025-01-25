import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';

export const TaskListHeader = () => {
  const stylingOptions = useStylingOptions();

  return (
    <div className="table border-y border-l border-gray-200">
      <div
        className="table-row"
        style={{
          height: stylingOptions.headerHeight - 2,
        }}
      >
        <div
          className="table-cell align-middle"
          style={{
            minWidth: stylingOptions.listCellWidth,
          }}
        >
          &nbsp;Name
        </div>
        <div
          className="border-r border-gray-300 opacity-100"
          style={{
            height: stylingOptions.headerHeight * 0.5,
            marginTop: stylingOptions.headerHeight * 0.2,
          }}
        />
        <div
          className="table-cell align-middle"
          style={{
            minWidth: stylingOptions.listCellWidth,
          }}
        >
          &nbsp;From
        </div>
        <div
          className="border-r border-gray-300 opacity-100"
          style={{
            height: stylingOptions.headerHeight * 0.5,
            marginTop: stylingOptions.headerHeight * 0.25,
          }}
        />
        <div
          className="table-cell align-middle"
          style={{
            minWidth: stylingOptions.listCellWidth,
          }}
        >
          &nbsp;To
        </div>
      </div>
    </div>
  );
};
