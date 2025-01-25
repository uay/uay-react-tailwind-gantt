import { useContext } from 'react';
import type { StylingOptions } from '~/model/public/StylingOptions';
import { StylingOptionsContext } from '~/context/StylingOptionsContext';

export const useStylingOptions = (): StylingOptions => {
  const options = useContext(StylingOptionsContext) || {};

  return {
    // Default values
    headerHeight: 50,
    columnWidth: 60,
    listCellWidth: '155px',
    rowHeight: 50,
    ganttHeight: 0,
    barCornerRadius: 3,
    handleWidth: 8,
    barFill: 60,
    barProgressColor: '#a3a3ff',
    barProgressSelectedColor: '#8282f5',
    barBackgroundColor: '#b8c2cc',
    barBackgroundSelectedColor: '#aeb8c2',
    projectProgressColor: '#7db59a',
    projectProgressSelectedColor: '#59a985',
    projectBackgroundColor: '#fac465',
    projectBackgroundSelectedColor: '#f7bb53',
    milestoneBackgroundColor: '#f1c453',
    milestoneBackgroundSelectedColor: '#f29e4c',
    arrowColor: 'grey',
    arrowIndent: 20,
    todayColor: 'rgba(252, 248, 227, 0.5)',
    ...options,
  };
};
