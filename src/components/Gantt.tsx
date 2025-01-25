import type { Task } from '~/model/public/Task';
import type { ThemeOptions } from '~/model/public/ThemeOptions';
import { ThemeOptionsContext } from '~/context/ThemeOptionsContext';
import type { EventOptions } from '~/model/public/EventOptions';
import type { DisplayOptions } from '~/model/public/DisplayOptions';
import type { StylingOptions } from '~/model/public/StylingOptions';
import { DisplayOptionsContext } from '~/context/DisplayOptionsContext';
import { EventOptionsContext } from '~/context/EventOptionsContext';
import { StylingOptionsContext } from '~/context/StylingOptionsContext';
import { GanttStateContext } from '~/context/GanttStateContext';
import { GanttRoot } from '~/components/gantt/GanttRoot';

export const Gantt = (props: GanttProps) => {
  return (
    <DisplayOptionsContext.Provider value={props.displayOptions || {}}>
      <EventOptionsContext.Provider value={props.eventOptions || {}}>
        <StylingOptionsContext.Provider value={props.stylingOptions || {}}>
          <ThemeOptionsContext.Provider value={props.themeOptions || {}}>
            <GanttStateContext.Provider value={{ tasks: props.tasks }}>
              <GanttRoot />
            </GanttStateContext.Provider>
          </ThemeOptionsContext.Provider>
        </StylingOptionsContext.Provider>
      </EventOptionsContext.Provider>
    </DisplayOptionsContext.Provider>
  );
};

interface GanttProps {
  readonly tasks: Task[];
  readonly themeOptions?: Partial<ThemeOptions>;
  readonly eventOptions?: Partial<EventOptions>;
  readonly displayOptions?: Partial<DisplayOptions>;
  readonly stylingOptions?: Partial<StylingOptions>;
}
