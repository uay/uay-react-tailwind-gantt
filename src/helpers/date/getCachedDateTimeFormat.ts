import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import DateTimeFormat = Intl.DateTimeFormat;

export const getCachedDateTimeFormat = (
  locString: string | string[],
  opts: DateTimeFormatOptions = {},
): DateTimeFormat => {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache[key];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }
  return dtf;
};

const intlDTCache: Record<string, DateTimeFormat> = {};
