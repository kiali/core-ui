import { TLSStatus } from './TLSStatus';
import { ControlPlaneMetricsMap, Metric } from './Metrics';
import { ValidationStatus } from './IstioObjects';
import { IstioConfigList } from './IstioConfigList';

export type NamespaceInfo = {
  name: string;
  cluster?: string;
  outboundPolicyMode?: string;
  status?: NamespaceStatus;
  tlsStatus?: TLSStatus;
  istioConfig?: IstioConfigList;
  validations?: ValidationStatus;
  metrics?: Metric[];
  errorMetrics?: Metric[];
  labels?: { [key: string]: string };
  controlPlaneMetrics?: ControlPlaneMetricsMap;
};

export type NamespaceStatus = {
  inNotReady: string[];
  inError: string[];
  inWarning: string[];
  inSuccess: string[];
  notAvailable: string[];
};
