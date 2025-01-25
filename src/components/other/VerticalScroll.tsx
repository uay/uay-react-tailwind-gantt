import type { SyntheticEvent } from 'react';
import { useEffect, useRef } from 'react';
import { useDisplayOptions } from '~/helpers/hooks/useDisplayOptions';
import { useStylingOptions } from '~/helpers/hooks/useStylingOptions';

export const VerticalScroll = (props: VerticalScrollProps) => {
  const display = useDisplayOptions();
  const styling = useStylingOptions();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = props.scroll;
    }
  }, [props.scroll]);

  return (
    <div
      style={{
        height: styling.ganttHeight,
        marginTop: styling.headerHeight,
        marginLeft: display.rtl ? '' : '-1rem',
      }}
      className="overflow-y-auto w-4 flex-shrink-0 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded-lg"
      onScroll={props.onScroll}
      ref={scrollRef}
    >
      <div style={{ height: props.ganttFullHeight, width: 1 }} />
    </div>
  );
};

type VerticalScrollProps = {
  readonly scroll: number;
  readonly ganttFullHeight: number;
  readonly onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
};
