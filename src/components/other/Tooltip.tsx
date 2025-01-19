import { useEffect, useRef, useState } from 'react';
import type { BarTask } from '~/model/BarTask';
import { StandardTooltipContent } from '~/components/other/StandardTooltipContent';
import { useDisplayOptions } from '~/helpers/hooks/useDisplayOptions';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';

export const Tooltip = (props: TooltipProps) => {
  const display = useDisplayOptions();
  const styling = useStylingOptions();

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);

  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

      let newRelatedY =
        props.task.index * styling.rowHeight -
        props.scrollY +
        styling.headerHeight;
      let newRelatedX: number;

      if (display.rtl) {
        newRelatedX =
          props.task.x1 -
          styling.arrowIndent * 1.5 -
          tooltipWidth -
          props.scrollX;
        if (newRelatedX < 0) {
          newRelatedX =
            props.task.x2 + styling.arrowIndent * 1.5 - props.scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > props.svgContainerWidth) {
          newRelatedX = props.svgContainerWidth - tooltipWidth;
          newRelatedY += styling.rowHeight;
        }
      } else {
        newRelatedX =
          props.task.x2 +
          styling.arrowIndent * 1.5 +
          props.taskListWidth -
          props.scrollX;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = props.taskListWidth + props.svgContainerWidth;
        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX =
            props.task.x1 +
            props.taskListWidth -
            styling.arrowIndent * 1.5 -
            props.scrollX -
            tooltipWidth;
        }
        if (newRelatedX < props.taskListWidth) {
          newRelatedX =
            props.svgContainerWidth + props.taskListWidth - tooltipWidth;
          newRelatedY += styling.rowHeight;
        }
      }

      const tooltipLowerPoint = tooltipHeight + newRelatedY - props.scrollY;
      if (tooltipLowerPoint > props.svgContainerHeight - props.scrollY) {
        newRelatedY = props.svgContainerHeight - tooltipHeight;
      }
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [
    tooltipRef,
    props.task,
    styling.arrowIndent,
    props.scrollX,
    props.scrollY,
    styling.headerHeight,
    props.taskListWidth,
    styling.rowHeight,
    props.svgContainerHeight,
    props.svgContainerWidth,
    display.rtl,
  ]);

  return (
    <div
      ref={tooltipRef}
      className={`absolute flex pointer-events-none select-none ${
        relatedX ? 'visible' : 'invisible'
      }`}
      style={{ left: relatedX, top: relatedY }}
    >
      <StandardTooltipContent task={props.task} />
    </div>
  );
};

type TooltipProps = {
  readonly task: BarTask;
  readonly svgContainerHeight: number;
  readonly svgContainerWidth: number;
  readonly svgWidth: number;
  readonly taskListWidth: number;
  readonly scrollX: number;
  readonly scrollY: number;
};
