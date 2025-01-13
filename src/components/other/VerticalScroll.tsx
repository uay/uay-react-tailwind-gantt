import React, { SyntheticEvent, useRef, useEffect } from 'react';

export const VerticalScroll: React.FC<VerticalScrollProps> = ({
  scroll,
  ganttHeight,
  ganttFullHeight,
  headerHeight,
  rtl,
  onScroll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scroll;
    }
  }, [scroll]);

  return (
    <div
      style={{
        height: ganttHeight,
        marginTop: headerHeight,
        marginLeft: rtl ? '' : '-1rem',
      }}
      className="overflow-y-auto w-4 flex-shrink-0 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded-lg"
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div style={{ height: ganttFullHeight, width: 1 }} />
    </div>
  );
};

type VerticalScrollProps = {
  readonly scroll: number;
  readonly ganttHeight: number;
  readonly ganttFullHeight: number;
  readonly headerHeight: number;
  readonly rtl: boolean;
  readonly onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
};
