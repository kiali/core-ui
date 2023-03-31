import { HealthAnnotationConfig, HealthAnnotationType } from '../HealthAnnotation';
import { RateHealthConfig, ToleranceConfig, RegexConfig } from '../ServerConfig';
import { RequestHealth, RequestType } from '../HealthStatus';
import { Responses, ResponseDetail } from '../Graph';
import { ComputedServerConfig } from '../../config/';
import { Rate, RequestTolerance } from './types';

export const emptyRate = (): Rate => {
  return { requestRate: 0, errorRate: 0, errorRatio: 0 };
};

export const DEFAULTCONF = {
  http: new RegExp('^[4|5]\\d\\d$'),
  grpc: new RegExp('^[1-9]$|^1[0-6]$')
};

export const requestsErrorRateCode = (requests: RequestType): number => {
  const rate: Rate = emptyRate();
  for (let [protocol, req] of Object.entries(requests)) {
    for (let [code, value] of Object.entries(req)) {
      rate.requestRate += value;
      if (Object.keys(DEFAULTCONF).includes(protocol) && DEFAULTCONF[protocol].test(code)) {
        rate.errorRate += value;
      }
    }
  }
  return rate.requestRate === 0 ? -1 : (rate.errorRate / rate.requestRate) * 100;
};

export const getHealthRateAnnotation = (config?: HealthAnnotationType): string | undefined => {
  return config && HealthAnnotationConfig.HEALTH_RATE in config
    ? config[HealthAnnotationConfig.HEALTH_RATE]
    : undefined;
};

export const getErrorCodeRate = (requests: RequestHealth): { inbound: number; outbound: number } => {
  return { inbound: requestsErrorRateCode(requests.inbound), outbound: requestsErrorRateCode(requests.outbound) };
};

/*
Cached this method to avoid use regexp in next calculations to improve performance
 */
export const checkExpr = (value: RegexConfig | undefined, testV: string): boolean => {
  let reg = value;
  if (!reg) {
    return true;
  }
  if (typeof value === 'string') {
    reg = new RegExp(value);
  }
  return (reg as RegExp).test(testV);
};

// Cache the configuration to avoid multiple calls to regExp
export let configCache: { [key: string]: RateHealthConfig } = {};

export const getRateHealthConfig = (
  serverConfig: ComputedServerConfig,
  ns: string,
  name: string,
  kind: string
): RateHealthConfig => {
  const key = ns + '_' + kind + '_' + name;
  // If we have the configuration cached then return it
  if (configCache[key]) {
    return configCache[key];
  }
  if (serverConfig.healthConfig && serverConfig.healthConfig.rate) {
    for (let rate of serverConfig.healthConfig.rate) {
      if (checkExpr(rate.namespace, ns) && checkExpr(rate.name, name) && checkExpr(rate.kind, kind)) {
        configCache[key] = rate;
        return rate;
      }
    }
  }
  return serverConfig.healthConfig.rate[serverConfig.healthConfig.rate.length - 1];
};

/*
For Responses object like { "200": { flags: { "-": 1.2, "XXX": 3.1}, hosts: ...} } Transform to RequestType

Return object like:  {"http": { "200": 4.3}}
*/
export const transformEdgeResponses = (requests: Responses, protocol: string): RequestType => {
  const prot: { [key: string]: number } = {};
  const result: RequestType = {};
  result[protocol] = prot;
  for (let [code, responseDetail] of Object.entries(requests)) {
    const percentRate = Object.values((responseDetail as ResponseDetail).flags).reduce((acc, value) =>
      String(Number(acc) + Number(value))
    );
    result[protocol][code] = Number(percentRate);
  }

  return result;
};

/*
 For requests type like { "http": { "200": 3.2, "501": 2.3 } ...} and a Tolerance Configuration to apply calculate the RequestToleranceGraph[]

 Return an array object where each item is a type RequestToleranceGraph by tolerance configuration passed by parameter

 Sample:

 [{
  tolerance: TOLERANCE CONFIGURATION,
  requests: {"http": 4.3}
 }]
 where this requests are the sum of rates where match the tolerance configuration.

*/
export const aggregate = (
  request: RequestType,
  tolerances?: ToleranceConfig[],
  graph: boolean = false
): RequestTolerance[] => {
  let result: RequestTolerance[] = [];
  if (request && tolerances) {
    for (let tol of Object.values(tolerances)) {
      let newReqTol: RequestTolerance = { tolerance: tol, requests: {} };
      graph ? generateRateForGraphTolerance(newReqTol, request) : generateRateForTolerance(newReqTol, request);
      result.push(newReqTol);
    }
  }
  return result;
};

export const generateRateForTolerance = (
  tol: RequestTolerance,
  requests: { [key: string]: { [key: string]: number } }
) => {
  for (let [protocol, req] of Object.entries(requests)) {
    if (checkExpr(tol!.tolerance!.protocol, protocol)) {
      for (let [code, value] of Object.entries(req)) {
        if (!Object.keys(tol.requests).includes(protocol)) {
          tol.requests[protocol] = emptyRate();
        }
        (tol.requests[protocol] as Rate).requestRate += Number(value);
        if (checkExpr(tol!.tolerance!.code, code)) {
          (tol.requests[protocol] as Rate).errorRate += Number(value);
        }
      }
    }
    if (Object.keys(tol.requests).includes(protocol)) {
      if ((tol.requests[protocol] as Rate).requestRate === 0) {
        (tol.requests[protocol] as Rate).errorRatio = -1;
      } else {
        (tol.requests[protocol] as Rate).errorRatio =
          (tol.requests[protocol] as Rate).errorRate / (tol.requests[protocol] as Rate).requestRate;
      }
    }
  }
};

/*
  Calculate the RequestToleranceGraph for a requests and a configuration
  Return the calculation in the object RequestToleranceGraph
*/

export const generateRateForGraphTolerance = (tol: RequestTolerance, requests: RequestType) => {
  // If we have a tolerance configuration then calculate
  if (tol.tolerance) {
    // For each requests type {<protocol:string> : { <code: string>: <rate: number> } }
    for (let [protocol, req] of Object.entries(requests)) {
      // Check if protocol configuration match the protocol request
      if (checkExpr(tol!.tolerance!.protocol, protocol)) {
        // Loop by the status code and rate for each code
        for (let [code, value] of Object.entries(req)) {
          // If code match the regular expression in the configuration then sum the rate
          if (checkExpr(tol!.tolerance!.code, code)) {
            tol.requests[protocol] = tol.requests[protocol] ? (tol.requests[protocol] as number) + value : value;
          }
        }
      }
    }
  }
};
