import { getRefreshIntervalName } from '../';

describe('getRefreshIntervalName', () => {
  // Tests that the function returns the corresponding refresh interval name without 'every ' when a valid refreshinterval value is passed. tags: [happy path]
  test('test_valid_refresh_interval', () => {
    const refreshInterval = 15000;
    const expectedName = '15s';
    expect(getRefreshIntervalName(refreshInterval)).toBe(expectedName);
  });
  // Tests that the function returns undefined when an invalid refreshinterval value is passed. tags: [edge case]
  test('test_invalid_refresh_interval', () => {
    const refreshInterval = -1;
    expect(getRefreshIntervalName(refreshInterval)).toBe('');
  });
});
