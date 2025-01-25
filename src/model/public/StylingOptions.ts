export interface StylingOptions {
  readonly headerHeight: number;
  readonly columnWidth: number;
  readonly listCellWidth: string;
  readonly rowHeight: number;
  readonly ganttHeight: number;
  readonly barCornerRadius: number;
  readonly handleWidth: number;

  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  readonly barFill: number;
  readonly barProgressColor: string;
  readonly barProgressSelectedColor: string;
  readonly barBackgroundColor: string;
  readonly barBackgroundSelectedColor: string;
  readonly projectProgressColor: string;
  readonly projectProgressSelectedColor: string;
  readonly projectBackgroundColor: string;
  readonly projectBackgroundSelectedColor: string;
  readonly milestoneBackgroundColor: string;
  readonly milestoneBackgroundSelectedColor: string;
  readonly arrowColor: string;
  readonly arrowIndent: number;
  readonly todayColor: string;
}
