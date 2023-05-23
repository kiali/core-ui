import { ActionType, createAction, createStandardAction } from 'typesafe-actions';
import { TourInfo } from '../types/Tour';
import { ActionKeys } from './ActionKeys';

export const TourActions = {
  endTour: createAction(ActionKeys.TOUR_END),
  setStop: createStandardAction(ActionKeys.TOUR_SET_STOP)<number>(),
  startTour: createStandardAction(ActionKeys.TOUR_START)<{ info: TourInfo; stop: number }>()
};

export type TourAction = ActionType<typeof TourActions>;
