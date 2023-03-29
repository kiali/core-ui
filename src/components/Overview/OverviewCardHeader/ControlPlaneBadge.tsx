import { Label } from '@patternfly/react-core';
import * as React from 'react';
import { IstioStatus } from '../../IstioStatus/IstioStatus';
import { ComponentStatus } from '../../../types';

type ControlPlaneBadgeProps = {
  status: ComponentStatus[];
};

export const ControlPlaneBadge = (props: ControlPlaneBadgeProps) => {
  return (
    <>
      <Label style={{ marginLeft: 5 }} color="green" isCompact>
        Control plane
      </Label>{' '}
      <IstioStatus istioStatus={props.status} />
    </>
  );
};
