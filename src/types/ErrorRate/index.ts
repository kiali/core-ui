import { getTrafficHealth } from './TrafficHealth';
import { calculateErrorRate, calculateStatus, sumRequests } from './ErrorRate';
import { aggregate, DEFAULTCONF, getRateHealthConfig } from './utils';

export { calculateErrorRate, DEFAULTCONF, getTrafficHealth };

/*

Export for testing

*/
export const getRateHealthConfigTEST = getRateHealthConfig;
export const calculateStatusTEST = calculateStatus;
export const aggregateTEST = aggregate;
export const sumRequestsTEST = sumRequests;
