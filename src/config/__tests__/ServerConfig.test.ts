import { isIstioNamespace, toValidDuration } from '..';

describe('isIstioNamespace', () => {
  // Tests that the function returns true when a valid namespace is provided. tags: [happy path]
  test('test_valid_namespace', () => {
    const result = isIstioNamespace('istio-system');
    expect(result).toBe(true);
  });

  // Tests that the function returns false when the input namespace is an empty string. tags: [edge case]
  test('test_empty_namespace', () => {
    const result = isIstioNamespace('');
    expect(result).toBe(false);
  });
});

describe('toValidDuration', () => {
  // Tests that a valid duration is returned when given a valid input. tags: [happy path]
  test('test_valid_duration: returns valid duration when given a valid input', () => {
    const duration = 2;
    expect(toValidDuration(duration)).toEqual(60);
  });

  // Tests that the closest valid duration is returned when given an invalid input. tags: [happy path]
  test('test_closest_duration: returns closest valid duration when given an invalid input', () => {
    const duration = 130;
    expect(toValidDuration(duration)).toEqual(120);
  });
});
