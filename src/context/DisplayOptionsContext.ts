import { createContext } from 'react';
import type { DisplayOptions } from '~/model/public/DisplayOptions';

export const DisplayOptionsContext = createContext<DisplayOptions>({});
