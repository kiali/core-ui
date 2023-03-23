import { jest } from '@jest/globals';
import { boundsToDuration, durationToBounds, evalTimeRange, guardTimeRange, isEqualTimeRange } from '../';
import { TimeRange } from '../';

const mockDate = 1466424490000;
const newD = new Date(mockDate);
let spy;

beforeAll(() => {
  spy = jest.spyOn(global, 'Date').mockImplementation(() => newD);
});

afterAll(() => {
  spy.mockRestore();
});

describe('durationToBounds', () => {
  test('test durationToBounds', () => {
    const result = durationToBounds(4000);
    expect(result).toStrictEqual({ from: 1466420490000 });
  });
});

describe('boundsToDuration', () => {
  test('test boundsToDuration', () => {
    const mockBound = { from: 1466424490000, to: 1467424490000 };
    const result = boundsToDuration(mockBound);
    expect(result).toBe(1000000);
  });
});

describe('isEqualTimeRange', () => {
  test('test isEqualTimeRange', () => {
    const t1 = { from: 1466424490000, to: 1467424490000, rangeDuration: 10000 };
    const t2 = { from: 1466424490000, to: 1467424490000, rangeDuration: 10000 };
    const t3 = { from: 1466424490000, to: 1567424490000, rangeDuration: 10000 };
    const t4 = { from: 1466424490000, to: 1667424490000 };
    const t5 = { from: 1466424490000, to: 1467424490000, rangeDuration: 20000 };
    expect(isEqualTimeRange(t1, t2)).toBeTruthy();
    expect(isEqualTimeRange(t1, t3)).toBeFalsy();
    expect(isEqualTimeRange(t1, t4)).toBeFalsy();
    expect(isEqualTimeRange(t1, t5)).toBeFalsy();
  });
});

describe('evalTimeRange', () => {
  test('test evalTimeRange', () => {
    const mockBound = { from: 1466424490000, to: 1467424490000, rangeDuration: 10000 };
    const result = evalTimeRange(mockBound);
    expect(result).toStrictEqual([new Date(mockBound.from), new Date(mockBound.to)]);
  });
});

describe('guardTimeRange', () => {
  test('test_if_bounded', () => {
    const range: TimeRange = {
      from: 1622505600000,
      to: 1622592000000
    };
    const result = guardTimeRange(
      range,
      _ => 'duration',
      _ => 'bounded'
    );
    expect(result).toBe('bounded');
  });

  test('test_if_duration', () => {
    const range: TimeRange = {
      rangeDuration: 86400
    };
    const result = guardTimeRange(
      range,
      _ => 'duration',
      _ => 'bounded'
    );
    expect(result).toBe('duration');
  });
});
