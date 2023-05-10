import { config } from '../config';
import { DurationInSeconds, IntervalInMilliseconds, TimeInMilliseconds, TimeRange } from './Common';

export interface InterfaceSettings {
  navCollapse: boolean;
}

export interface UserSettings {
  duration: DurationInSeconds;
  interface: InterfaceSettings;
  refreshInterval: IntervalInMilliseconds;
  replayActive: boolean;
  replayQueryTime: TimeInMilliseconds;
  timeRange: TimeRange;
}

export const INITIAL_USER_SETTINGS_STATE: UserSettings = {
  duration: config.toolbar.defaultDuration,
  timeRange: config.toolbar.defaultTimeRange,
  interface: { navCollapse: false },
  refreshInterval: config.toolbar.defaultRefreshInterval,
  replayActive: false,
  replayQueryTime: 0
};
