import { createContext } from 'react';
import type { StylingOptions } from '~/model/public/StylingOptions';

export const StylingOptionsContext = createContext<StylingOptions>({});
