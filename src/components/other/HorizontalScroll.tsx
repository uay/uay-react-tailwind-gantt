import { useRef, useEffect } from 'react';
import type { SyntheticEvent } from 'react';

export const HorizontalScroll = ({
  scroll,
  svgWidth,
  taskListWidth,
  rtl,
  onScroll,
}: HorizontalScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scroll;
    }
  }, [scroll]);

  return (
    <div
      dir="ltr"
      style={{
        margin: rtl
          ? `0px ${taskListWidth}px 0px 0px`
          : `0px 0px 0px ${taskListWidth}px`,
      }}
      className="overflow-auto max-w-full h-5 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded-lg"
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div style={{ width: svgWidth }} className="h-1" />
    </div>
  );
};

type HorizontalScrollProps = {
  readonly scroll: number;
  readonly svgWidth: number;
  readonly taskListWidth: number;
  readonly rtl: boolean;
  readonly onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
};
