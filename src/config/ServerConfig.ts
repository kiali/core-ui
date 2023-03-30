import _ from 'lodash';
import { ServerConfig } from '../types/';
import { parseHealthConfig } from './';

export type Durations = { [key: number]: string };

export type ComputedServerConfig = ServerConfig & {
  durations: Durations;
};

export const humanDurations = (cfg: ComputedServerConfig, prefix?: string, suffix?: string) =>
  _.mapValues(cfg.durations, v => _.reject([prefix, v, suffix], _.isEmpty).join(' '));

const toDurations = (tupleArray: [number, string][]): Durations => {
  const obj = {};
  tupleArray.forEach(tuple => {
    obj[tuple[0]] = tuple[1];
  });
  return obj;
};

const durationsTuples: [number, string][] = [
  [60, '1m'],
  [120, '2m'],
  [300, '5m'],
  [600, '10m'],
  [1800, '30m'],
  [3600, '1h'],
  [10800, '3h'],
  [21600, '6h'],
  [43200, '12h'],
  [86400, '1d'],
  [604800, '7d'],
  [2592000, '30d']
];

export const computeValidDurations = (cfg: ComputedServerConfig) => {
  const tsdbRetention = cfg.prometheus.storageTsdbRetention;
  const scrapeInterval = cfg.prometheus.globalScrapeInterval;
  let filtered = durationsTuples.filter(
    d => (!tsdbRetention || d[0] <= tsdbRetention!) && (!scrapeInterval || d[0] >= scrapeInterval * 2)
  );
  // Make sure we keep at least one item, even if it's silly
  if (filtered.length === 0) {
    filtered = [durationsTuples[0]];
  }
  cfg.durations = toDurations(filtered);
};

// Set some reasonable defaults. Initial values should be valid for fields
// than may not be providedby/set on the server.
export const defaultServerConfig: ComputedServerConfig = {
  accessibleNamespaces: [],
  authStrategy: '',
  clusters: {},
  durations: {},
  gatewayAPIEnabled: false,
  logLevel: '',
  healthConfig: {
    rate: []
  },
  deployment: {
    viewOnlyMode: false
  },
  installationTag: 'Kiali Console',
  istioAnnotations: {
    istioInjectionAnnotation: 'sidecar.istio.io/inject'
  },
  istioCanaryRevision: {
    current: '',
    upgrade: ''
  },
  istioIdentityDomain: 'svc.cluster.local',
  istioNamespace: 'istio-system',
  istioLabels: {
    appLabelName: 'app',
    injectionLabelName: 'istio-injection',
    injectionLabelRev: 'istio.io/rev',
    versionLabelName: 'version'
  },
  kialiFeatureFlags: {
    certificatesInformationIndicators: {
      enabled: true
    },
    disabledFeatures: [],
    istioInjectionAction: true,
    istioAnnotationAction: true,
    istioUpgradeAction: false,
    uiDefaults: {
      graph: {
        findOptions: [],
        hideOptions: [],
        settings: {
          fontLabel: 13,
          minFontBadge: 7,
          minFontLabel: 10
        },
        traffic: {
          grpc: 'requests',
          http: 'requests',
          tcp: 'sent'
        }
      }
    }
  },
  prometheus: {
    globalScrapeInterval: 15,
    storageTsdbRetention: 21600
  }
};

export const setServerConfig = (serverConfig: ComputedServerConfig, cfg: ServerConfig) => {
  serverConfig = {
    ...defaultServerConfig,
    ...cfg
  };

  serverConfig.healthConfig = cfg.healthConfig ? parseHealthConfig(cfg.healthConfig) : serverConfig.healthConfig;
  computeValidDurations(serverConfig);

  return serverConfig;
};

export const isIstioNamespace = (serverConfig: ComputedServerConfig, namespace: string): boolean => {
  if (namespace === serverConfig.istioNamespace) {
    return true;
  }
  return false;
};
