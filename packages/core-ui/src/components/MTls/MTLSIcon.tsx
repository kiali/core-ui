import * as React from 'react';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { MTLSStatusFull, MTLSStatusFullDark, MTLSStatusPartial, MTLSStatusPartialDark } from '../../icons';

export { MTLSStatusFull, MTLSStatusPartial, MTLSStatusFullDark, MTLSStatusPartialDark };

type Props = {
  icon: string;
  iconClassName: string;
  tooltipText: string;
  tooltipPosition: TooltipPosition;
};

export enum MTLSIconTypes {
  LOCK_FULL = 'LOCK_FULL',
  LOCK_HOLLOW = 'LOCK_HOLLOW',
  LOCK_FULL_DARK = 'LOCK_FULL_DARK',
  LOCK_HOLLOW_DARK = 'LOCK_HOLLOW_DARK'
}

const nameToSource: { [key: string]: JSX.Element } = {
  LOCK_FULL: <MTLSStatusFull />,
  LOCK_HOLLOW: <MTLSStatusFullDark />,
  LOCK_FULL_DARK: <MTLSStatusPartial />,
  LOCK_HOLLOW_DARK: <MTLSStatusPartialDark />
};

class MTLSIcon extends React.Component<Props> {
  render() {
    return (
      <Tooltip
        aria-label={'mTLS status'}
        position={this.props.tooltipPosition}
        enableFlip={true}
        content={this.props.tooltipText}
      >
        {nameToSource[this.props.icon]}
      </Tooltip>
    );
  }
}
export default MTLSIcon;
