import * as React from 'react';

import { MTLSIconTypes } from './MTLSIcon';
import { default as MTLSStatus, emptyDescriptor, StatusDescriptor } from './MTLSStatus';
import { MTLSStatuses, getKialiStyle } from '@kiali/types';

type Props = {
  status: string;
};

const statusDescriptors = new Map<string, StatusDescriptor>([
  [
    MTLSStatuses.ENABLED,
    {
      message: 'mTLS is enabled for this namespace',
      icon: MTLSIconTypes.LOCK_FULL_DARK,
      showStatus: true
    }
  ],
  [
    MTLSStatuses.ENABLED_EXTENDED,
    {
      message: 'mTLS is enabled for this namespace, extended from Mesh-wide config',
      icon: MTLSIconTypes.LOCK_FULL_DARK,
      showStatus: true
    }
  ],
  [
    MTLSStatuses.PARTIALLY,
    {
      message: 'mTLS is partially enabled for this namespace',
      icon: MTLSIconTypes.LOCK_HOLLOW_DARK,
      showStatus: true
    }
  ],
  [MTLSStatuses.DISABLED, emptyDescriptor],
  [MTLSStatuses.NOT_ENABLED, emptyDescriptor]
]);

// Magic style to align Istio Config icons on top of status overview
const iconStyle = getKialiStyle({
  marginTop: -3,
  marginRight: 18,
  marginLeft: 2,
  width: 10
});

export const NamespaceMTLSStatus = (props: Props) => {
  return <MTLSStatus status={props.status} className={iconStyle} statusDescriptors={statusDescriptors} />;
};
