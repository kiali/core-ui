import { AppHealth, Namespace, ObjectReference } from './';

export interface AppList {
  namespace: Namespace;
  applications: AppOverview[];
}

export interface AppOverview {
  name: string;
  istioSidecar: boolean;
  labels: { [key: string]: string };
  istioReferences: ObjectReference[];
  health: AppHealth;
}

export interface AppListItem extends AppOverview {
  namespace: string;
}
