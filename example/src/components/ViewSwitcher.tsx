import React from 'react';
import {ViewMode} from 'uay-react-tailwind-gantt';

type ViewSwitcherProps = {
  readonly viewMode: ViewMode;
  readonly isChecked: boolean;
  readonly onViewListChange: (isChecked: boolean) => void;
  readonly onViewModeChange: (viewMode: ViewMode) => void;
};

const viewModes: ViewMode[] = [
  ViewMode.Hour,
  ViewMode.QuarterDay,
  ViewMode.HalfDay,
  ViewMode.Day,
  ViewMode.Week,
  ViewMode.Month,
  ViewMode.QuarterYear,
  ViewMode.Year,
];

export const ViewSwitcher: React.FC<ViewSwitcherProps> = (props) => {
  return (
    <div className="list-none flex justify-end items-center">
      {viewModes.map((mode) => (
        <button
          key={mode}
          className={[
            props.viewMode === mode ? 'text-black bg-gray-400' : 'text-black bg-gray-200',
            "border-none py-1.5 px-4 no-underline m-1 cursor-pointer text-sm text-center",
          ].filter(Boolean).join(' ')}
          onClick={() => props.onViewModeChange(mode)}
        >
          {mode}
        </button>
      ))}
      <div className="m-1 mx-4 text-sm font-sans flex justify-center items-center">
        <label className="relative inline-block w-15 h-7.5 mr-1.5 cursor-pointer">
          <input
            className="focus:shadow-[0_0_1px_#2196f3]"
            type="checkbox"
            defaultChecked={props.isChecked}
            onClick={() => props.onViewListChange(!props.isChecked)}
          />
          {' '}
          Show Task List
        </label>
      </div>
    </div>
  );
};
