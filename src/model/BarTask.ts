import type { Task } from '~/model/public/Task';
import type { TaskTypeInternal } from '~/model/TaskTypeInternal';

export interface BarTask extends Task {
  readonly index: number;
  readonly typeInternal: TaskTypeInternal;
  readonly x1: number;
  readonly x2: number;
  readonly y: number;
  readonly height: number;
  readonly progressX: number;
  readonly progressWidth: number;
  readonly barCornerRadius: number;
  readonly handleWidth: number;
  readonly barChildren: BarTask[];
  readonly styles: {
    readonly backgroundColor: string;
    readonly backgroundSelectedColor: string;
    readonly progressColor: string;
    readonly progressSelectedColor: string;
  };
}
