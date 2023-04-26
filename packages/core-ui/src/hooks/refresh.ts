import { TimeInMilliseconds } from '@kiali/types';

function doTick(time?: TimeInMilliseconds) {
  const refreshTick = new CustomEvent('refreshTick', { detail: time ?? Date.now() });
  document.dispatchEvent(refreshTick);
}

export function triggerRefresh(time?: TimeInMilliseconds) {
  doTick(time);
}
