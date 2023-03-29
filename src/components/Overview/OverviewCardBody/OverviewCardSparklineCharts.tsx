import * as React from 'react';
import { DirectionType } from '../OverviewToolbar';
import { ControlPlaneMetricsMap, DurationInSeconds, IstiodResourceThresholds, Metric } from '../../../types';
import OverviewCardDataPlaneNamespace from './OverviewCardDataPlaneNamespace';
import OverviewCardControlPlaneNamespace from './OverviewCardControlPlaneNamespace';
import { ComputedServerConfig } from '../../../config';

type Props = {
  name: string;
  duration: DurationInSeconds;
  direction: DirectionType;
  metrics?: Metric[];
  errorMetrics?: Metric[];
  controlPlaneMetrics?: ControlPlaneMetricsMap;
  istiodResourceThresholds?: IstiodResourceThresholds;
  istioAPIEnabled?: boolean;
  isIstioNamespace?: boolean;
  config: ComputedServerConfig;
};

export const OverviewCardSparklineCharts = (props: Props) => {
  return (
    <>
      {(!props.isIstioNamespace || !props.istioAPIEnabled) && (
        <OverviewCardDataPlaneNamespace
          metrics={props.metrics}
          errorMetrics={props.errorMetrics}
          duration={props.duration}
          direction={props.direction}
          config={props.config}
        />
      )}
      {props.isIstioNamespace && props.istioAPIEnabled && (
        <OverviewCardControlPlaneNamespace
          pilotLatency={props.controlPlaneMetrics?.istiod_proxy_time}
          istiodMemory={props.controlPlaneMetrics?.istiod_mem}
          istiodCpu={props.controlPlaneMetrics?.istiod_cpu}
          duration={props.duration}
          istiodResourceThresholds={props.istiodResourceThresholds}
          config={props.config}
        />
      )}
    </>
  );
};
