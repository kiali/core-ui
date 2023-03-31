import {
  HEALTHY,
  NA,
  RATIO_NA,
  RequestHealth,
  RequestType,
  ThresholdStatus,
  getRequestErrorsStatus
} from '../HealthStatus';
import { RateHealth } from '../HealthAnnotation';
import { ToleranceConfig } from '../ServerConfig';
import { checkExpr, getRateHealthConfig, getErrorCodeRate, aggregate } from './utils';
import { ComputedServerConfig } from '../../config';
import { ErrorRatio, Rate, RequestTolerance } from './types';

// Sum the inbound and outbound request for calculating the global status
export const sumRequests = (inbound: RequestType, outbound: RequestType): RequestType => {
  let result: RequestType = {};
  // init result with a deep clone of inbound
  for (let [protocol, req] of Object.entries(inbound)) {
    result[protocol] = {};
    for (let [code, rate] of Object.entries(req)) {
      result[protocol][code] = rate;
    }
  }
  for (let [protocol, req] of Object.entries(outbound)) {
    if (!Object.keys(result).includes(protocol)) {
      result[protocol] = {};
    }
    for (let [code, rate] of Object.entries(req)) {
      if (!Object.keys(result[protocol]).includes(code)) {
        result[protocol][code] = 0;
      }
      result[protocol][code] += rate;
    }
  }
  return result;
};

const getAggregate = (
  requests: RequestHealth,
  conf: ToleranceConfig[]
): { global: RequestTolerance[]; inbound: RequestTolerance[]; outbound: RequestTolerance[] } => {
  // Get all tolerances where direction is inbound
  const inboundTolerances = conf.filter(tol => checkExpr(tol.direction, 'inbound'));
  // Get all tolerances where direction is outbound
  const outboundTolerances = conf.filter(tol => checkExpr(tol.direction, 'outbound'));

  return {
    global: aggregate(sumRequests(requests.inbound, requests.outbound), conf),
    inbound: aggregate(requests.inbound, inboundTolerances),
    outbound: aggregate(requests.outbound, outboundTolerances)
  };
};

export const calculateErrorRate = (
  serverConfig: ComputedServerConfig,
  ns: string,
  name: string,
  kind: string,
  requests: RequestHealth
): { errorRatio: ErrorRatio; config: ToleranceConfig[] } => {
  // Get the first configuration that match with the case
  const rateAnnotation = new RateHealth(requests.healthAnnotations);
  const conf = rateAnnotation.toleranceConfig || getRateHealthConfig(serverConfig, ns, name, kind).tolerance;

  // Get aggregate
  let status = getAggregate(requests, conf);
  const globalStatus = calculateStatus(status.global);

  if (globalStatus.status.status !== HEALTHY) {
    return {
      errorRatio: {
        global: globalStatus,
        inbound: calculateStatus(status.inbound),
        outbound: calculateStatus(status.outbound)
      },
      config: conf
    };
  }
  const result = {
    errorRatio: {
      global: globalStatus,
      inbound: calculateStatus(status.inbound),
      outbound: calculateStatus(status.outbound)
    },
    config: conf
  };

  // IF status is HEALTHY return errorCodes
  if (result.errorRatio.inbound.status.status === HEALTHY || result.errorRatio.outbound.status.status === HEALTHY) {
    const valuesErrorCodes = getErrorCodeRate(requests);
    result.errorRatio.inbound.status.value =
      result.errorRatio.inbound.status.status === HEALTHY
        ? valuesErrorCodes.inbound
        : result.errorRatio.inbound.status.value;
    result.errorRatio.outbound.status.value =
      result.errorRatio.outbound.status.status === HEALTHY
        ? valuesErrorCodes.outbound
        : result.errorRatio.outbound.status.value;
  }
  // In that case we want to keep values
  return result;
};

export const calculateStatus = (
  requestTolerances: RequestTolerance[]
): { status: ThresholdStatus; protocol: string; toleranceConfig?: ToleranceConfig } => {
  let result: { status: ThresholdStatus; protocol: string; toleranceConfig?: ToleranceConfig } = {
    status: {
      value: RATIO_NA,
      status: NA
    },
    protocol: '',
    toleranceConfig: undefined
  };

  for (let reqTol of Object.values(requestTolerances)) {
    for (let [protocol, rate] of Object.entries(reqTol.requests)) {
      const tolerance =
        reqTol.tolerance && checkExpr(reqTol!.tolerance!.protocol, protocol) ? reqTol.tolerance : undefined;
      // Calculate the status for the tolerance provided
      const auxStatus = getRequestErrorsStatus((rate as Rate).errorRatio, tolerance);
      // Check the priority of the status
      if (auxStatus.status.priority > result.status.status.priority) {
        result.status = auxStatus;
        result.protocol = protocol;
        result.toleranceConfig = reqTol.tolerance;
      }
    }
  }
  return result;
};
