import * as React from 'react';
import { SVGIconProps } from '@patternfly/react-icons/dist/esm/createIcon';
import { ResourcesFullIcon } from '@patternfly/react-icons';
import { PFColors } from '../Pf/PfColors';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { ComponentStatus, IStatus } from '../../types';
import IstioStatusList from './IstioStatusList';

type StatusIcons = {
  ErrorIcon?: React.ComponentClass<SVGIconProps>;
  WarningIcon?: React.ComponentClass<SVGIconProps>;
  InfoIcon?: React.ComponentClass<SVGIconProps>;
  HealthyIcon?: React.ComponentClass<SVGIconProps>;
};

type Props = {
  icons?: StatusIcons;
  istioStatus: ComponentStatus[];
};

const ValidToColor = {
  'true-true-true': PFColors.Danger,
  'true-true-false': PFColors.Danger,
  'true-false-true': PFColors.Danger,
  'true-false-false': PFColors.Danger,
  'false-true-true': PFColors.Warning,
  'false-true-false': PFColors.Warning,
  'false-false-true': PFColors.Info,
  'false-false-false': PFColors.Success
};

const defaultIcons = {
  ErrorIcon: ResourcesFullIcon,
  WarningIcon: ResourcesFullIcon,
  InfoIcon: ResourcesFullIcon,
  HealthyIcon: ResourcesFullIcon
};
export class IstioStatus extends React.Component<Props> {
  tooltipContent = () => {
    return <IstioStatusList status={this.props.istioStatus} />;
  };

  tooltipColor = () => {
    let coreUnhealthy: boolean = false;
    let addonUnhealthy: boolean = false;
    let notReady: boolean = false;

    Object.keys(this.props.istioStatus || {}).forEach((compKey: string) => {
      const { status, is_core } = this.props.istioStatus[compKey];
      const isNotReady: boolean = status === IStatus.NotReady;
      const isUnhealthy: boolean = status !== IStatus.Healthy && !isNotReady;

      if (is_core) {
        coreUnhealthy = coreUnhealthy || isUnhealthy;
      } else {
        addonUnhealthy = addonUnhealthy || isUnhealthy;
      }

      notReady = notReady || isNotReady;
    });

    return ValidToColor[`${coreUnhealthy}-${addonUnhealthy}-${notReady}`];
  };

  healthyComponents = () => {
    return this.props.istioStatus.reduce((healthy: boolean, compStatus: ComponentStatus) => {
      return healthy && compStatus.status === IStatus.Healthy;
    }, true);
  };

  render() {
    if (!this.healthyComponents()) {
      const icons = this.props.icons ? { ...defaultIcons, ...this.props.icons } : defaultIcons;
      const iconColor = this.tooltipColor();
      let Icon: React.ComponentClass<SVGIconProps> = ResourcesFullIcon;

      if (iconColor === PFColors.Danger) {
        Icon = icons.ErrorIcon;
      } else if (iconColor === PFColors.Warning) {
        Icon = icons.WarningIcon;
      } else if (iconColor === PFColors.Info) {
        Icon = icons.InfoIcon;
      } else if (iconColor === PFColors.Success) {
        Icon = icons.HealthyIcon;
      }

      return (
        <Tooltip position={TooltipPosition.left} enableFlip={true} content={this.tooltipContent()} maxWidth={'25rem'}>
          <Icon color={iconColor} style={{ verticalAlign: '-0.2em', marginRight: -8 }} />
        </Tooltip>
      );
    }

    return null;
  }
}

export default IstioStatus;
