import { useEffect, useRef, useState } from 'react';
import type { BarTask } from '~/model/BarTask';
import { StandardTooltipContent } from '~/components/other/StandardTooltipContent';

export const Tooltip = (props: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);

  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

      let newRelatedY =
        props.task.index * props.rowHeight - props.scrollY + props.headerHeight;
      let newRelatedX: number;

      if (props.rtl) {
        newRelatedX =
          props.task.x1 -
          props.arrowIndent * 1.5 -
          tooltipWidth -
          props.scrollX;
        if (newRelatedX < 0) {
          newRelatedX = props.task.x2 + props.arrowIndent * 1.5 - props.scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > props.svgContainerWidth) {
          newRelatedX = props.svgContainerWidth - tooltipWidth;
          newRelatedY += props.rowHeight;
        }
      } else {
        newRelatedX =
          props.task.x2 +
          props.arrowIndent * 1.5 +
          props.taskListWidth -
          props.scrollX;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = props.taskListWidth + props.svgContainerWidth;
        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX =
            props.task.x1 +
            props.taskListWidth -
            props.arrowIndent * 1.5 -
            props.scrollX -
            tooltipWidth;
        }
        if (newRelatedX < props.taskListWidth) {
          newRelatedX =
            props.svgContainerWidth + props.taskListWidth - tooltipWidth;
          newRelatedY += props.rowHeight;
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
    props.arrowIndent,
    props.scrollX,
    props.scrollY,
    props.headerHeight,
    props.taskListWidth,
    props.rowHeight,
    props.svgContainerHeight,
    props.svgContainerWidth,
    props.rtl,
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
  readonly arrowIndent: number;
  readonly rtl: boolean;
  readonly svgContainerHeight: number;
  readonly svgContainerWidth: number;
  readonly svgWidth: number;
  readonly headerHeight: number;
  readonly taskListWidth: number;
  readonly scrollX: number;
  readonly scrollY: number;
  readonly rowHeight: number;
};
