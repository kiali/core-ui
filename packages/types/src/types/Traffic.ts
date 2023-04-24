import { DestService, HealthAnnotationType, ProtocolTraffic, NodeType, SEInfo } from './';

export interface AppNode {
  id: string;
  type: NodeType.APP;
  namespace: string;
  name: string;
  version: string;
  isInaccessible: boolean;
}

export interface WorkloadNode {
  id: string;
  type: NodeType.WORKLOAD;
  namespace: string;
  name: string;
  isInaccessible: boolean;
  healthAnnotation?: HealthAnnotationType;
}

export interface ServiceNode {
  id: string;
  type: NodeType.SERVICE;
  namespace: string;
  name: string;
  isInaccessible: boolean;
  isServiceEntry?: SEInfo;
  destServices?: DestService[];
  healthAnnotation?: HealthAnnotationType;
}

export type TrafficDirection = 'inbound' | 'outbound';
export type TrafficNode = AppNode | ServiceNode | WorkloadNode;

export interface TrafficItem {
  direction: TrafficDirection;
  node: TrafficNode;
  proxy?: TrafficItem;
  traffic: ProtocolTraffic;
  mTLS?: number;
}
