import * as React from 'react';
import { DurationDropdownComponent } from '../DurationDropdown/DurationDropdown';
import { DurationInSeconds } from '../../types/Common';
import { Tooltip, TooltipPosition, Button, ButtonVariant } from '@patternfly/react-core';
import { KialiIcon, defaultIconStyle } from '../../config/KialiIcon';
import { ComputedServerConfig } from '../../config';

type TimeControlsProps = {
  disabled: boolean;
  id: string;
  duration: DurationInSeconds;
  setDuration: (duration: DurationInSeconds) => void;
  replayActive?: boolean;
  toggleReplayActive?: () => void;
  supportsReplay?: boolean;
  serverConfig: ComputedServerConfig;
};

export class TimeDurationComponent extends React.PureComponent<TimeControlsProps> {
  render() {
    const durationTooltip = this.props.replayActive ? 'Traffic metrics per frame' : 'Traffic metrics per refresh';
    let [prefix, suffix] = this.props.replayActive ? [undefined, 'Traffic'] : ['Last', undefined];

    return (
      <span>
        {this.props.supportsReplay && !this.props.replayActive && (
          <Tooltip key={'time_range_replay'} position={TooltipPosition.left} content="Replay...">
            <Button
              data-test="graph-replay-button"
              variant={ButtonVariant.link}
              style={{ padding: '1px 6px 0 0' }}
              onClick={this.onToggleReplay}
            >
              <KialiIcon.History className={defaultIconStyle} />
            </Button>
          </Tooltip>
        )}
        <DurationDropdownComponent
          id={'time_range_duration'}
          disabled={this.props.disabled}
          duration={this.props.duration}
          setDuration={this.props.setDuration}
          prefix={prefix}
          suffix={suffix}
          tooltip={durationTooltip}
          tooltipPosition={TooltipPosition.left}
          serverConfig={this.props.serverConfig}
        />
        {this.props.supportsReplay && this.props.replayActive && (
          <Button
            data-test="graph-replay-close-button"
            variant={ButtonVariant.link}
            style={{ margin: '1px 0 0 5px' }}
            onClick={this.onToggleReplay}
          >
            <span>
              <KialiIcon.Close className={defaultIconStyle} />
              {`  Close Replay`}
            </span>
          </Button>
        )}
      </span>
    );
  }

  private onToggleReplay = () => {
    this.props.toggleReplayActive ? this.props.toggleReplayActive() : {};
  };
}

export default TimeDurationComponent;
