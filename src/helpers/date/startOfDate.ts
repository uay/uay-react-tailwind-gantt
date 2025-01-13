import type { DateHelperScales } from '../../model/DateHelperScales';

export const startOfDate = (date: Date, scale: DateHelperScales) => {
  const scores = [
    'millisecond',
    'second',
    'minute',
    'hour',
    'day',
    'month',
    'year',
  ];

  const shouldReset = (_scale: DateHelperScales) => {
    const maxScore = scores.indexOf(scale);
    return scores.indexOf(_scale) <= maxScore;
  };

  return new Date(
    date.getFullYear(),
    shouldReset('year') ? 0 : date.getMonth(),
    shouldReset('month') ? 1 : date.getDate(),
    shouldReset('day') ? 0 : date.getHours(),
    shouldReset('hour') ? 0 : date.getMinutes(),
    shouldReset('minute') ? 0 : date.getSeconds(),
    shouldReset('second') ? 0 : date.getMilliseconds(),
  );
};
