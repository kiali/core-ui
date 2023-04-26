import { Card } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  CanaryUpgradeStatus,
  CertsInfo,
  ComponentStatus,
  NamespaceInfo,
  OutboundTrafficPolicy,
  IstiodResourceThresholds,
  ComputedServerConfig
} from '@kiali/types';
import { DirectionType, OverviewDisplayMode, OverviewType } from './OverviewToolbar';
import * as React from 'react';
import { OverviewCardHeader } from './OverviewCardHeader';
import { OverviewCardBody } from './OverviewCardBody';
import { getKialiStyle } from '../../utils/StyleUtils';

const cardControlPlaneGridStyle = getKialiStyle({
  textAlign: 'center',
  marginTop: '0px',
  marginBottom: '10px'
});
const cardGridStyle = getKialiStyle({
  textAlign: 'center',
  marginTop: '0px',
  marginBottom: '10px'
});

export type OverviewCardProps = {
  canaryStatus?: CanaryUpgradeStatus;
  className?: string;
  displayMode: OverviewDisplayMode;
  direction: DirectionType;
  duration: number;
  hasCanaryUpgradeConfigured?: boolean;
  istioNamespace?: boolean;
  istioStatus?: ComponentStatus[];
  istioAPIEnabled?: boolean;
  istiodResourceThresholds?: IstiodResourceThresholds;
  linkIstio?: string;
  ns: NamespaceInfo;
  outboundTrafficPolicy: OutboundTrafficPolicy;
  overviewType: OverviewType;
  setDisplayMode?: (mode: OverviewDisplayMode) => void;
  certificatesInformationIndicators?: boolean;
  certsTLSversion?: string;
  certsInfo?: CertsInfo[];
  config: ComputedServerConfig;
};

export const OverviewCard = (props: OverviewCardProps) => {
  return (
    <Card
      isCompact={true}
      className={css(props.istioNamespace ? cardControlPlaneGridStyle : cardGridStyle, props.className)}
    >
      <OverviewCardHeader {...props} />
      <OverviewCardBody {...props} />
    </Card>
  );
};
