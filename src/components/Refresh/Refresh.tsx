import * as React from 'react';
import { config } from '../../config';
import { IntervalInMilliseconds } from '../../types/Common';
import { ToolbarDropdown } from '../ToolbarDropwdown/ToolbarDropdown';
import RefreshButtonContainer from './RefreshButton';
import { TooltipPosition } from '@patternfly/react-core';

type ComponentProps = {
  refreshInterval: IntervalInMilliseconds;
  setRefreshInterval: (refreshInterval: IntervalInMilliseconds) => void;
  id: string;
  disabled?: boolean;
  hideLabel?: boolean;
  hideRefreshButton?: boolean;
  manageURL?: boolean;
  menuAppendTo?: HTMLElement | (() => HTMLElement) | 'parent' | 'inline';
  triggerRefresh?: () => void;
};

const REFRESH_INTERVALS = config.toolbar.refreshInterval;

export class Refresh extends React.PureComponent<ComponentProps> {
  constructor(props: ComponentProps) {
    super(props);
  }

  render() {
    if (this.props.refreshInterval !== undefined) {
      const { hideLabel } = this.props;
      return (
        <>
          {!hideLabel && <label style={{ paddingRight: '0.5em', marginLeft: '1.5em' }}>Refreshing</label>}
          <ToolbarDropdown
            id={this.props.id}
            handleSelect={value => this.updateRefreshInterval(Number(value))}
            value={String(this.props.refreshInterval)}
            label={REFRESH_INTERVALS[this.props.refreshInterval]}
            menuAppendTo={this.props.menuAppendTo}
            options={REFRESH_INTERVALS}
            tooltip={'Refresh interval'}
            tooltipPosition={TooltipPosition.left}
          />
          {this.props.hideRefreshButton || (
            <RefreshButtonContainer handleRefresh={() => this.props.triggerRefresh} disabled={this.props.disabled} />
          )}
        </>
      );
    } else {
      return this.props.hideRefreshButton ? null : (
        <RefreshButtonContainer handleRefresh={() => this.props.triggerRefresh} />
      );
    }
  }

  private updateRefreshInterval = (refreshInterval: IntervalInMilliseconds) => {
    this.props.setRefreshInterval(refreshInterval); // notify redux of the change
  };
}

export default Refresh;
