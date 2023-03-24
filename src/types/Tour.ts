import * as React from 'react';
import { PopoverPosition } from '@patternfly/react-core';

export interface TourStopInfo {
  description?: string; // displayed as the tour stop body
  distance?: number; // distance from target, default=25
  isValid?: boolean; // internal use, leave unset
  htmlDescription?: React.ReactNode;
  name: string; // displayed in the tour stop header.
  position?: PopoverPosition;
}

export interface TourInfo {
  name: string;
  stops: Array<TourStopInfo>;
}
