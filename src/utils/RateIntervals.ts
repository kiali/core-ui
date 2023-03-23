import { config } from '../config/Config';
import { serverConfig } from '../config/ServerConfig';
import { IntervalInMilliseconds } from '../types/Common';

export const getName = (durationSeconds: number): string => {
  const name = serverConfig.durations[durationSeconds];
  if (name) {
    return name;
  }
  return durationSeconds + ' seconds';
};

export const getRefreshIntervalName = (refreshInterval: IntervalInMilliseconds): string => {
  const refreshIntervalOption = config.toolbar.refreshInterval[refreshInterval];
  return refreshIntervalOption ? refreshIntervalOption.replace('Every ', '') : '';
};
