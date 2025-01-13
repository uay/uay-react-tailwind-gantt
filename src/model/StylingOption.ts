import React from 'react';
import { Task } from './Task';

export interface StylingOption {
  readonly headerHeight?: number;
  readonly columnWidth?: number;
  readonly listCellWidth?: string;
  readonly rowHeight?: number;
  readonly ganttHeight?: number;
  readonly barCornerRadius?: number;
  readonly handleWidth?: number;
  readonly fontFamily?: string;
  readonly fontSize?: string;
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  readonly barFill?: number;
  readonly barProgressColor?: string;
  readonly barProgressSelectedColor?: string;
  readonly barBackgroundColor?: string;
  readonly barBackgroundSelectedColor?: string;
  readonly projectProgressColor?: string;
  readonly projectProgressSelectedColor?: string;
  readonly projectBackgroundColor?: string;
  readonly projectBackgroundSelectedColor?: string;
  readonly milestoneBackgroundColor?: string;
  readonly milestoneBackgroundSelectedColor?: string;
  readonly arrowColor?: string;
  readonly arrowIndent?: number;
  readonly todayColor?: string;
  readonly TooltipContent?: React.FC<{
    readonly task: Task;
    readonly fontSize: string;
    readonly fontFamily: string;
  }>;
  readonly TaskListHeader?: React.FC<{
    readonly headerHeight: number;
    readonly rowWidth: string;
    readonly fontFamily: string;
    readonly fontSize: string;
  }>;
  readonly TaskListTable?: React.FC<{
    readonly rowHeight: number;
    readonly rowWidth: string;
    readonly fontFamily: string;
    readonly fontSize: string;
    readonly locale: string;
    readonly tasks: Task[];
    readonly selectedTaskId: string;
    /**
     * Sets selected task by id
     */
    readonly setSelectedTask: (taskId: string) => void;
    readonly onExpanderClick: (task: Task) => void;
  }>;
}
