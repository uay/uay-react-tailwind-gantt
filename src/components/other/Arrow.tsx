import type { BarTask } from '~/model/BarTask';
import { useThemeOptions } from '~/helpers/hooks/useThemeOptions';
import { buildThemedProps } from '~/helpers/buildThemedProps';
import { ThemeEntry } from '~/model/public/ThemeEntry';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';
import { useDisplayOptions } from '~/helpers/hooks/useDisplayOptions';

export const Arrow = (props: ArrowProps) => {
  const display = useDisplayOptions();
  const styling = useStylingOptions();
  const theme = useThemeOptions();

  let path: string;
  let trianglePoints: string;
  if (display.rtl) {
    [path, trianglePoints] = drownPathAndTriangleRTL(
      props.taskFrom,
      props.taskTo,
      styling.rowHeight,
      props.taskHeight,
      styling.arrowIndent,
    );
  } else {
    [path, trianglePoints] = drownPathAndTriangle(
      props.taskFrom,
      props.taskTo,
      styling.rowHeight,
      props.taskHeight,
      styling.arrowIndent,
    );
  }

  return (
    <g
      {...buildThemedProps({
        theme,
        entry: ThemeEntry.Arrow,
      })}
    >
      <path strokeWidth="1.5" d={path} fill="none" />
      <polygon points={trianglePoints} />
    </g>
  );
};

type ArrowProps = {
  readonly taskFrom: BarTask;
  readonly taskTo: BarTask;
  readonly taskHeight: number;
};

const drownPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number,
) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  const taskFromEndPosition = taskFrom.x2 + arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition < taskTo.x1 ? '' : `H ${taskTo.x1 - arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition > taskTo.x1
      ? arrowIndent
      : taskTo.x1 - taskFrom.x2 - arrowIndent;

  const path = `M ${taskFrom.x2} ${taskFrom.y + taskHeight / 2}
  h ${arrowIndent}
  v ${(indexCompare * rowHeight) / 2}
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition}
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskTo.x1},${taskToEndPosition}
  ${taskTo.x1 - 5},${taskToEndPosition - 5}
  ${taskTo.x1 - 5},${taskToEndPosition + 5}`;
  return [path, trianglePoints];
};

const drownPathAndTriangleRTL = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number,
) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  const taskFromEndPosition = taskFrom.x1 - arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition > taskTo.x2 ? '' : `H ${taskTo.x2 + arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition < taskTo.x2
      ? -arrowIndent
      : taskTo.x2 - taskFrom.x1 + arrowIndent;

  const path = `M ${taskFrom.x1} ${taskFrom.y + taskHeight / 2}
  h ${-arrowIndent}
  v ${(indexCompare * rowHeight) / 2}
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition}
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskTo.x2},${taskToEndPosition}
  ${taskTo.x2 + 5},${taskToEndPosition + 5}
  ${taskTo.x2 + 5},${taskToEndPosition - 5}`;
  return [path, trianglePoints];
};
