import ToolbarDropdown from '../ToolbarDropwdown/ToolbarDropdown';
import * as React from 'react';
import { TooltipPosition } from '@patternfly/react-core';
import { ComputedServerConfig, DurationInSeconds, humanDurations } from '@kiali/types';

type DurationDropdownProps = {
  id: string;
  disabled?: boolean;
  duration: DurationInSeconds;
  setDuration: (duration: DurationInSeconds) => void;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  menuAppendTo?: HTMLElement | (() => HTMLElement) | 'parent' | 'inline';
  nameDropdown?: string;
  suffix?: string;
  prefix?: string;
  serverConfig: ComputedServerConfig;
};

export class DurationDropdown extends React.Component<DurationDropdownProps> {
  render() {
    const durations = humanDurations(this.props.serverConfig, this.props.prefix, this.props.suffix);

    return (
      <ToolbarDropdown
        id={this.props.id}
        disabled={this.props.disabled}
        handleSelect={key => this.updateDurationInterval(Number(key))}
        value={String(this.props.duration)}
        label={durations[this.props.duration]}
        options={durations}
        tooltip={this.props.tooltip}
        tooltipPosition={this.props.tooltipPosition}
        nameDropdown={this.props.nameDropdown}
        menuAppendTo={this.props.menuAppendTo}
      />
    );
  }

  private updateDurationInterval = (duration: number) => {
    this.props.setDuration(duration); // notify redux of the change
  };
}

const withDurations = DurationDropdownComponent => {
  return (props: DurationDropdownProps) => {
    return (
      <DurationDropdownComponent
        durations={humanDurations(props.serverConfig, props.prefix, props.suffix)}
        {...props}
      />
    );
  };
};

export const DurationDropdownComponent = withDurations(DurationDropdown);
