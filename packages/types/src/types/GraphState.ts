import { KialiDagreGraph } from '../layout/KialiDagreGraph';
import { TimeInMilliseconds } from './Common';
import {
  EdgeLabelMode,
  EdgeMode,
  GraphDefinition,
  GraphType,
  Layout,
  NodeParamsType,
  RankMode,
  RankResult,
  SummaryData,
  TrafficRate
} from './Graph';

// Various pages are described here with their various sections
export interface GraphToolbarState {
  // dropdown props
  edgeLabels: EdgeLabelMode[];
  graphType: GraphType;
  rankBy: RankMode[];
  trafficRates: TrafficRate[];
  // find props
  findValue: string;
  hideValue: string;
  showFindHelp: boolean;
  // Toggle props
  boxByCluster: boolean;
  boxByNamespace: boolean;
  compressOnHide: boolean;
  showIdleEdges: boolean;
  showIdleNodes: boolean;
  showLegend: boolean;
  showMissingSidecars: boolean;
  showOperationNodes: boolean;
  showRank: boolean;
  showSecurity: boolean;
  showServiceNodes: boolean;
  showTrafficAnimation: boolean;
  showVirtualServices: boolean;
}

export interface GraphState {
  edgeMode: EdgeMode;
  graphDefinition: GraphDefinition | null; // Not for consumption. Only for "Debug" dialog.
  layout: Layout;
  namespaceLayout: Layout;
  node?: NodeParamsType;
  rankResult: RankResult;
  summaryData: SummaryData | null;
  toolbarState: GraphToolbarState;
  updateTime: TimeInMilliseconds;
}

export const INITIAL_GRAPH_STATE: GraphState = {
  edgeMode: EdgeMode.ALL,
  graphDefinition: null,
  layout: KialiDagreGraph.getLayout(),
  namespaceLayout: KialiDagreGraph.getLayout(),
  node: undefined,
  rankResult: {
    upperBound: 0
  },
  summaryData: null,
  toolbarState: {
    boxByCluster: true,
    boxByNamespace: true,
    compressOnHide: true,
    edgeLabels: [],
    findValue: '',
    graphType: GraphType.VERSIONED_APP,
    hideValue: '',
    rankBy: [],
    showFindHelp: false,
    showIdleEdges: false,
    showIdleNodes: false,
    showLegend: false,
    showMissingSidecars: true,
    showOperationNodes: false,
    showRank: false,
    showSecurity: false,
    showServiceNodes: true,
    showTrafficAnimation: false,
    showVirtualServices: true,
    trafficRates: [
      TrafficRate.GRPC_GROUP,
      TrafficRate.GRPC_REQUEST,
      TrafficRate.HTTP_GROUP,
      TrafficRate.HTTP_REQUEST,
      TrafficRate.TCP_GROUP,
      TrafficRate.TCP_SENT
    ]
  },
  updateTime: 0
};
