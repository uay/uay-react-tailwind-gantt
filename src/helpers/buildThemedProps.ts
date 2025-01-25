import type { ThemeOptions } from '~/model/public/ThemeOptions';
import type { ThemeEntry } from '~/model/public/ThemeEntry';

export const buildThemedProps = (props: BuildThemedProps): BuildedProps => {
  if (!props.entry) {
    return {};
  }

  const result: BuildedProps = {
    ['data-theme-entry']: props.entry,
  };

  const overwrite = props.theme[props.entry];

  if (!overwrite) {
    if (typeof props.className === 'string') {
      return {
        ...result,
        className: props.className,
      };
    }

    if (!props.className) {
      // No error needed here
      return result;
    }

    if (!Array.isArray(props.className)) {
      // This should not happen if the types are correct
      console.error('Invalid buildThemedProps configuration:', props);
      return result;
    }

    return {
      ...result,
      className: props.className
        .map(it => it.trim())
        .filter(Boolean)
        .join(' '),
    };
  }

  if (typeof overwrite === 'string') {
    return {
      ...result,
      className: overwrite,
    };
  }

  if (typeof overwrite !== 'function') {
    // This should not happen if the types are correct
    console.error('Invalid buildThemedProps configuration:', props);
    return result;
  }

  return {
    ...result,
    className: overwrite(...(props.contextArgs || [])),
  };
};

type BuildThemedProps = {
  readonly theme: ThemeOptions;
  readonly entry: ThemeEntry;
  readonly className?: string | string[];
  readonly contextArgs?: any[];
};

type BuildedProps = {
  readonly ['data-theme-entry']?: ThemeEntry;
  readonly className?: string;
};
