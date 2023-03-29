import * as React from 'react';
import { DEGRADED, FAILURE, HEALTHY, NOT_READY, NamespaceInfo } from '../../../types/';
import OverviewStatus from './OverviewStatus';
import { OverviewType } from '../OverviewToolbar';
import { switchType } from '../OverviewHelper';

type Props = {
  ns: NamespaceInfo;
  type: OverviewType;
};

export const NamespaceStatuses = (props: Props) => {
  const name = props.ns.name;
  const status = props.ns.status;
  let nbItems = 0;

  if (status) {
    nbItems =
      status.inError.length +
      status.inWarning.length +
      status.inSuccess.length +
      status.notAvailable.length +
      status.inNotReady.length;
  }
  let text: string;
  if (nbItems === 1) {
    text = switchType(props.type, '1 application', '1 service', '1 workload');
  } else {
    text = nbItems + switchType(props.type, ' applications', ' services', ' workloads');
  }
  const mainLink = (
    <div
      style={{ display: 'inline-block', width: '125px', whiteSpace: 'nowrap' }}
      data-test={'overview-type-' + props.type}
    >
      {text}
    </div>
  );
  if (nbItems === props.ns.status?.notAvailable.length) {
    return (
      <div style={{ textAlign: 'left' }}>
        <span>
          {mainLink}
          <div style={{ display: 'inline-block', marginLeft: '5px' }}>N/A</div>
        </span>
      </div>
    );
  }
  return (
    <>
      <div style={{ textAlign: 'left' }}>
        <span>
          {mainLink}
          <div style={{ display: 'inline-block' }} data-test="overview-app-health">
            {status && status.inNotReady.length > 0 && (
              <OverviewStatus id={name + '-not-ready'} namespace={name} status={NOT_READY} items={status.inNotReady} />
            )}
            {status && status.inError.length > 0 && (
              <OverviewStatus id={name + '-failure'} namespace={name} status={FAILURE} items={status.inError} />
            )}
            {status && status.inWarning.length > 0 && (
              <OverviewStatus id={name + '-degraded'} namespace={name} status={DEGRADED} items={status.inWarning} />
            )}
            {status && status.inSuccess.length > 0 && (
              <OverviewStatus id={name + '-healthy'} namespace={name} status={HEALTHY} items={status.inSuccess} />
            )}
          </div>
        </span>
      </div>
    </>
  );
};
