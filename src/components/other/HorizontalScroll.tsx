import type { SyntheticEvent } from 'react';
import { useEffect, useRef } from 'react';
import { useDisplayOptions } from '~/helpers/hooks/useDisplayOptions';

export const HorizontalScroll = (props: HorizontalScrollProps) => {
  const display = useDisplayOptions();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = props.scroll;
    }
  }, [props.scroll]);

  return (
    <div
      dir="ltr"
      style={{
        margin: display.rtl
          ? `0px ${props.taskListWidth}px 0px 0px`
          : `0px 0px 0px ${props.taskListWidth}px`,
      }}
      className="overflow-auto max-w-full h-5 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded-lg"
      onScroll={props.onScroll}
      ref={scrollRef}
    >
      <div style={{ width: props.svgWidth }} className="h-1" />
    </div>
  );
};

type HorizontalScrollProps = {
  readonly scroll: number;
  readonly svgWidth: number;
  readonly taskListWidth: number;
  readonly onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
};
