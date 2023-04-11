import * as React from 'react';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { Status } from '../../../types/';
import { createIcon } from '../../Health/Helper';

import '../../Health/Health.css';

type Props = {
  id: string;
  namespace: string;
  status: Status;
  items: string[];
};

class OverviewStatus extends React.Component<Props, {}> {
  render() {
    const length = this.props.items.length;
    let items = this.props.items;
    if (items.length > 6) {
      items = items.slice(0, 5);
      items.push('and ' + (length - items.length) + ' more...');
    }
    const tooltipContent = (
      <div>
        <strong>{this.props.status.name}</strong>
        {items.map((app, idx) => {
          return (
            <div data-test={this.props.id + '-' + app} key={this.props.id + '-' + idx}>
              <span style={{ marginRight: '10px' }}>{createIcon(this.props.status, 'sm')}</span> {app}
            </div>
          );
        })}
      </div>
    );

    return (
      <Tooltip
        aria-label={'Overview status'}
        position={TooltipPosition.auto}
        content={tooltipContent}
        className={'health_indicator'}
      >
        <div style={{ display: 'inline-block', marginRight: '5px' }}>
          {createIcon(this.props.status)}
          {' ' + length}
        </div>
      </Tooltip>
    );
  }
}
export default OverviewStatus;
