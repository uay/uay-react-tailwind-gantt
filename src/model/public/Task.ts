import type { TaskType } from '~/model/public/TaskType';

export interface Task {
  readonly id: string;
  readonly type: TaskType;
  readonly name: string;
  readonly start: Date;
  readonly end: Date;
  /**
   * From 0 to 100
   */
  readonly progress: number;
  readonly styles?: {
    readonly backgroundColor?: string;
    readonly backgroundSelectedColor?: string;
    readonly progressColor?: string;
    readonly progressSelectedColor?: string;
  };
  readonly isDisabled?: boolean;
  readonly project?: string;
  readonly dependencies?: string[];
  readonly hideChildren?: boolean;
  readonly displayOrder?: number;
}
