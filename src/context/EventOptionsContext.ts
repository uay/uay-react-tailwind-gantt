import { createContext } from 'react';
import type { EventOptions } from '~/model/public/EventOptions';

export const EventOptionsContext = createContext<Partial<EventOptions>>({});
