import { AppHealthResponse, Namespace, Runtime } from './';

export interface AppId {
  namespace: string;
  app: string;
}

export interface AppWorkload {
  workloadName: string;
  istioSidecar: boolean;
  serviceAccountNames: string[];
  labels: { [key: string]: string };
}

export interface App {
  namespace: Namespace;
  name: string;
  workloads: AppWorkload[];
  serviceNames: string[];
  runtimes: Runtime[];
  health: AppHealthResponse;
}
