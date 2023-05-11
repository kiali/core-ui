import { ClusterSummaryTable, ClusterTable } from './ClusterTable';
import { RouteSummaryTable, RouteTable } from './RouteTable';
import { ListenerSummaryTable, ListenerTable } from './ListenerTable';
import { EnvoyProxyDump, Namespace } from '@kiali/types';
import { ResourceSorts } from '../EnvoyDetails';

export const SummaryTableBuilder = (
  resource: string,
  config: EnvoyProxyDump,
  sortBy: ResourceSorts,
  namespaces: Namespace[],
  namespace: string,
  routeLinkHandler: () => void,
  workload?: string
) => {
  let writerComp, writerProps;

  switch (resource) {
    case 'clusters':
      writerComp = ClusterSummaryTable;
      writerProps = new ClusterTable(config.clusters || [], sortBy['clusters'], namespaces, namespace);
      break;
    case 'listeners':
      writerComp = ListenerSummaryTable;
      writerProps = new ListenerTable(
        config.listeners || [],
        sortBy['listeners'],
        namespaces,
        namespace,
        workload,
        routeLinkHandler
      );
      break;
    case 'routes':
      writerComp = RouteSummaryTable;
      writerProps = new RouteTable(config.routes || [], sortBy['routes'], namespaces, namespace);
      break;
  }
  return [writerComp, writerProps];
};
