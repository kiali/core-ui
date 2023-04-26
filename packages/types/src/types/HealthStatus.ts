import * as React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  MinusCircleIcon,
  UnknownIcon
} from '@patternfly/react-icons';
import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import { HealthAnnotationType } from './HealthAnnotation';
import { PFColors } from './PfColors';
import { ToleranceConfig } from './ServerConfig';

/*
RequestType interface
- where the structure is type {<protocol>: {<code>:value ...} ...}

Example: { "http": {"200": 2, "404": 1 ...} ... }
*/
export interface RequestType {
  [key: string]: { [key: string]: number };
}
export interface RequestHealth {
  inbound: RequestType;
  outbound: RequestType;
  healthAnnotations: HealthAnnotationType;
}

export interface Status {
  name: string;
  color: string;
  priority: number;
  icon: React.ComponentClass<SVGIconProps>;
  class: string;
}

export interface ProxyStatus {
  CDS: string;
  EDS: string;
  LDS: string;
  RDS: string;
}

export const FAILURE: Status = {
  name: 'Failure',
  color: PFColors.Danger,
  priority: 4,
  icon: ExclamationCircleIcon,
  class: 'icon-failure'
};
export const DEGRADED: Status = {
  name: 'Degraded',
  color: PFColors.Warning,
  priority: 3,
  icon: ExclamationTriangleIcon,
  class: 'icon-degraded'
};
export const NOT_READY: Status = {
  name: 'Not Ready',
  color: PFColors.InfoBackground,
  priority: 2,
  icon: MinusCircleIcon,
  class: 'icon-idle'
};
export const HEALTHY: Status = {
  name: 'Healthy',
  color: PFColors.Success,
  priority: 1,
  icon: CheckCircleIcon,
  class: 'icon-healthy'
};
export const NA: Status = {
  name: 'No health information',
  color: PFColors.Black600,
  priority: 0,
  icon: UnknownIcon,
  class: 'icon-na'
};

export interface Thresholds {
  degraded: number;
  failure: number;
  unit: string;
}

export interface ThresholdStatus {
  value: number;
  status: Status;
  violation?: string;
}

export const POD_STATUS = 'Pod Status';

// Use -1 rather than NaN to allow straigthforward comparison
export const RATIO_NA = -1;

export const ascendingThresholdCheck = (value: number, thresholds: Thresholds): ThresholdStatus => {
  if (value > 0) {
    if (value >= thresholds.failure) {
      return {
        value: value,
        status: FAILURE,
        violation: value.toFixed(2) + thresholds.unit + '>=' + thresholds.failure + thresholds.unit
      };
    } else if (value >= thresholds.degraded) {
      return {
        value: value,
        status: DEGRADED,
        violation: value.toFixed(2) + thresholds.unit + '>=' + thresholds.degraded + thresholds.unit
      };
    }
  }

  return { value: value, status: HEALTHY };
};

export const getRequestErrorsStatus = (ratio: number, tolerance?: ToleranceConfig): ThresholdStatus => {
  if (tolerance && ratio >= 0) {
    let thresholds = {
      degraded: tolerance.degraded,
      failure: tolerance.failure,
      unit: '%'
    };
    return ascendingThresholdCheck(100 * ratio, thresholds);
  }

  return {
    value: RATIO_NA,
    status: NA
  };
};
