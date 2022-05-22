import { DateTime } from 'luxon';

export interface Activity {
  start: DateTime,
  end?: DateTime,
  title: string;
  Component: JSX.Element;
}
