import { CardBody, Grid, GridItem, Tooltip, TooltipPosition } from '@patternfly/react-core';
import {
  CanaryUpgradeStatus,
  CertsInfo,
  ComponentStatus,
  IstiodResourceThresholds,
  NamespaceInfo,
  OutboundTrafficPolicy,
  ValidationStatus
} from '../../../types';
import { NamespaceStatuses } from './NamespaceStatuses';
import CanaryUpgradeProgress from './CanaryUpgradeProgress';
import { OverviewCardSparklineCharts } from './OverviewCardSparklineCharts';
import TLSInfo from './TLSInfo';
import ControlPlaneNamespaceStatus from './ControlPlaneNamespaceStatus';
import { DirectionType, OverviewDisplayMode, OverviewType } from '../OverviewToolbar';
import { NamespaceMTLSStatus } from '../../MTls/NamespaceMTLSStatus';
import { ValidationSummary } from '../../Validations';
import ValidationSummaryLinkContainer from '../../Link/ValidationSummaryLink';
import * as React from 'react';
import { ComputedServerConfig } from '../../../config';
import { PFColors } from '../../Pf';

const renderLabels = (ns: NamespaceInfo, setDisplayMode?: (display: OverviewDisplayMode) => void): JSX.Element => {
  const labelsLength = ns.labels ? `${Object.entries(ns.labels).length}` : 'No';
  const labelContent = ns.labels ? (
    <Tooltip
      aria-label={'Labels list'}
      position={TooltipPosition.right}
      enableFlip={true}
      distance={5}
      content={
        <ul>
          {Object.entries(ns.labels || []).map(([key, value]) => (
            <li key={key}>
              {key}={value}
            </li>
          ))}
        </ul>
      }
    >
      <div id="labels_info" style={{ display: 'inline' }}>
        {labelsLength} label{labelsLength !== '1' ? 's' : ''}
      </div>
    </Tooltip>
  ) : (
    <div style={{ textAlign: 'left' }}>No labels</div>
  );

  return ns.labels && setDisplayMode ? (
    <div
      style={{ color: PFColors.Blue400, textAlign: 'left', cursor: 'pointer' }}
      onClick={() => setDisplayMode(OverviewDisplayMode.LIST)}
    >
      {labelContent}
    </div>
  ) : (
    <div style={{ textAlign: 'left' }}>{labelContent}</div>
  );
};

const renderIstioConfigStatus = (ns: NamespaceInfo, link?: string): JSX.Element => {
  let validations: ValidationStatus = { objectCount: 0, errors: 0, warnings: 0 };
  if (ns.validations) {
    validations = ns.validations;
  }

  return (
    <ValidationSummaryLinkContainer
      namespace={ns.name}
      objectCount={validations.objectCount}
      errors={validations.errors}
      warnings={validations.warnings}
      link={link}
    >
      <ValidationSummary
        id={'ns-val-' + ns.name}
        errors={validations.errors}
        warnings={validations.warnings}
        objectCount={validations.objectCount}
      />
    </ValidationSummaryLinkContainer>
  );
};

const renderCharts = (
  ns: NamespaceInfo,
  duration: number,
  direction: DirectionType,
  displayMode: OverviewDisplayMode,
  overviewType: OverviewType,
  config: ComputedServerConfig,
  isIstioNamespace?: boolean,
  istioAPIEnabled?: boolean,
  istiodResourceThresholds?: IstiodResourceThresholds
): JSX.Element => {
  if (ns.status) {
    if (displayMode === OverviewDisplayMode.COMPACT) {
      return <NamespaceStatuses key={ns.name} ns={ns} type={overviewType} />;
    }
    return (
      <OverviewCardSparklineCharts
        key={ns.name}
        name={ns.name}
        duration={duration}
        direction={direction}
        metrics={ns.metrics}
        errorMetrics={ns.errorMetrics}
        controlPlaneMetrics={ns.controlPlaneMetrics}
        istiodResourceThresholds={istiodResourceThresholds}
        istioAPIEnabled={istioAPIEnabled}
        isIstioNamespace={isIstioNamespace}
        config={config}
      />
    );
  }
  return <div style={{ height: 70 }} />;
};
export type OverviewCardBodyProps = {
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
  outboundTrafficPolicy: OutboundTrafficPolicy;
  ns: NamespaceInfo;
  setDisplayMode?: (mode: OverviewDisplayMode) => void;
  overviewType: OverviewType;
  certificatesInformationIndicators?: boolean;
  certsTLSversion?: string;
  certsInfo?: CertsInfo[];
  config: ComputedServerConfig;
};

//{this.state.displayMode === OverviewDisplayMode.EXPAND && this.renderCharts(ns)}

export const OverviewCardBody = (props: OverviewCardBodyProps) => {
  return (
    <CardBody>
      {props.istioNamespace && props.displayMode === OverviewDisplayMode.EXPAND && (
        <Grid>
          <GridItem md={props.istioAPIEnabled || props.hasCanaryUpgradeConfigured ? 3 : 6}>
            {renderLabels(props.ns, props.setDisplayMode)}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'inline-block', width: '125px' }}>Istio config</div>
              {props.ns.tlsStatus && (
                <span>
                  <NamespaceMTLSStatus status={props.ns.tlsStatus.status} />
                </span>
              )}
              {props.istioAPIEnabled ? renderIstioConfigStatus(props.ns, props.linkIstio) : 'N/A'}
            </div>
            {props.ns.status && <NamespaceStatuses ns={props.ns} type={props.overviewType} />}
            {props.displayMode === OverviewDisplayMode.EXPAND && (
              <ControlPlaneNamespaceStatus
                outboundTrafficPolicy={props.outboundTrafficPolicy}
                namespace={props.ns}
              ></ControlPlaneNamespaceStatus>
            )}
            {props.displayMode === OverviewDisplayMode.EXPAND && (
              <TLSInfo
                certificatesInformationIndicators={props.certificatesInformationIndicators}
                version={props.certsTLSversion}
                certsInfo={props.certsInfo}
              ></TLSInfo>
            )}
          </GridItem>
          <GridItem md={9}>
            <Grid>
              {props.hasCanaryUpgradeConfigured && props.canaryStatus && (
                <GridItem md={props.istioAPIEnabled ? 4 : 9}>
                  <CanaryUpgradeProgress canaryUpgradeStatus={props.canaryStatus} />
                </GridItem>
              )}
              {props.istioAPIEnabled && (
                <GridItem md={props.hasCanaryUpgradeConfigured ? 8 : 12}>
                  {renderCharts(
                    props.ns,
                    props.duration,
                    props.direction,
                    props.displayMode,
                    props.overviewType,
                    props.config,
                    props.istioNamespace,
                    props.istioAPIEnabled,
                    props.istiodResourceThresholds
                  )}
                </GridItem>
              )}
            </Grid>
          </GridItem>
        </Grid>
      )}
      {((!props.istioNamespace && props.displayMode === OverviewDisplayMode.EXPAND) ||
        props.displayMode === OverviewDisplayMode.COMPACT) && (
        <>
          {renderLabels(props.ns, props.setDisplayMode)}
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-block', width: '125px' }}>Istio config</div>
            {props.ns.tlsStatus && (
              <span>
                <NamespaceMTLSStatus status={props.ns.tlsStatus.status} />
              </span>
            )}
            {props.istioAPIEnabled ? renderIstioConfigStatus(props.ns) : 'N/A'}
          </div>
          <NamespaceStatuses ns={props.ns} type={props.overviewType} />
          {props.displayMode === OverviewDisplayMode.EXPAND &&
            renderCharts(
              props.ns,
              props.duration,
              props.direction,
              props.displayMode,
              props.overviewType,
              props.config,
              props.istioNamespace,
              props.istioAPIEnabled,
              props.istiodResourceThresholds
            )}
        </>
      )}
    </CardBody>
  );
};
