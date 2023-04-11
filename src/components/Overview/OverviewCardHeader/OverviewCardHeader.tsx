import { CardHeader, CardHeaderMain, Label, Title, TitleSizes } from '@patternfly/react-core';
import { ControlPlaneBadge } from './ControlPlaneBadge';
import { ControlPlaneVersionBadge } from './ControlPlaneVersionBadge';
import { CanaryUpgradeStatus, ComponentStatus, NamespaceInfo } from '../../../types';
import * as React from 'react';
import { style } from 'typestyle';

const NS_LONG = 20;

const cardNamespaceNameLongStyle = style({
  display: 'inline-block',
  maxWidth: 'calc(100% - 75px)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap'
});

const cardNamespaceNameNormalStyle = style({
  display: 'inline-block',
  verticalAlign: 'middle'
});

export type OverviewCardHeaderProps = {
  ns: NamespaceInfo;
  istioNamespace?: boolean;
  istioStatus?: ComponentStatus[];
  istioAPIEnabled?: boolean;
  hasCanaryUpgradeConfigured?: boolean;
  canaryStatus?: CanaryUpgradeStatus;
};

export const OverviewCardHeader = (props: OverviewCardHeaderProps) => {
  const isLongNs = props.ns.name.length > NS_LONG;
  return (
    <CardHeader>
      <CardHeaderMain>
        <Title headingLevel="h5" size={TitleSizes.lg}>
          <span title={props.ns.name} className={isLongNs ? cardNamespaceNameLongStyle : cardNamespaceNameNormalStyle}>
            {props.ns.name}
            {props.istioNamespace && props.istioStatus && <ControlPlaneBadge status={props.istioStatus} />}
            {props.istioNamespace &&
              props.hasCanaryUpgradeConfigured &&
              props.canaryStatus?.migratedNamespaces.includes(props.ns.name) && (
                <ControlPlaneVersionBadge
                  version={props.canaryStatus.upgradeVersion}
                  isCanary={true}
                ></ControlPlaneVersionBadge>
              )}
            {props.istioNamespace &&
              props.hasCanaryUpgradeConfigured &&
              props.canaryStatus?.pendingNamespaces.includes(props.ns.name) && (
                <ControlPlaneVersionBadge
                  version={props.canaryStatus.currentVersion}
                  isCanary={false}
                ></ControlPlaneVersionBadge>
              )}
            {props.istioNamespace && !props.istioAPIEnabled && (
              <Label style={{ marginLeft: 10 }} color={'orange'} isCompact>
                Istio API disabled
              </Label>
            )}
          </span>
        </Title>
      </CardHeaderMain>
    </CardHeader>
  );
};
