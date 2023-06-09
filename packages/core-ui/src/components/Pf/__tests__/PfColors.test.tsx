import { PFColors } from '@kiali/types';
import { PFColorVals, setPFColorVals } from '../';

describe('PFColorVals', () => {
  test('Expect PFColors object', () => {
    expect(PFColors).toMatchInlineSnapshot(`
{
  "Active": "var(--pf-global--active-color--400)",
  "ActiveText": "var(--pf-global--primary-color--200)",
  "Badge": "var(--pf-global--palette--blue-300)",
  "Black100": "var(--pf-global--palette--black-100)",
  "Black1000": "var(--pf-global--palette--black-1000)",
  "Black150": "var(--pf-global--palette--black-150)",
  "Black200": "var(--pf-global--palette--black-200)",
  "Black600": "var(--pf-global--palette--black-600)",
  "Black700": "var(--pf-global--palette--black-700)",
  "Black800": "var(--pf-global--palette--black-800)",
  "Black900": "var(--pf-global--palette--black-900)",
  "Blue200": "var(--pf-global--palette--blue-200)",
  "Blue300": "var(--pf-global--palette--blue-300)",
  "Blue400": "var(--pf-global--palette--blue-400)",
  "Blue500": "var(--pf-global--palette--blue-500)",
  "ChartDanger": "var(--pf-global--danger-color--300)",
  "ChartOther": "var(--pf-global--palette-black-1000)",
  "ChartWarning": "var(--pf-global--danger-color--100)",
  "Cyan300": "var(--pf-global--palette--cyan-300)",
  "Danger": "var(--pf-global--danger-color--100)",
  "Gold400": "var(--pf-global--palette--gold-400)",
  "Green300": "var(--pf-global--palette--green-300)",
  "Green400": "var(--pf-global--palette--green-400)",
  "Green500": "var(--pf-global--palette--green-500)",
  "Green600": "var(--pf-global--palette--green-600)",
  "Info": "var(--pf-global--info-color--100)",
  "InfoBackground": "var(--pf-global--info-color--200)",
  "LightBlue400": "var(--pf-global--palette--light-blue-400)",
  "LightGreen400": "var(--pf-global--palette--light-green-400)",
  "LightGreen500": "var(--pf-global--palette--light-green-500)",
  "Orange400": "var(--pf-global--palette--orange-400)",
  "Purple100": "var(--pf-global--palette--purple-100)",
  "Purple500": "var(--pf-global--palette--purple-500)",
  "Red100": "var(--pf-global--palette--red-100)",
  "Red200": "var(--pf-global--palette--red-200)",
  "Red500": "var(--pf-global--palette--red-500)",
  "Replay": "var(--pf-global--active-color--300)",
  "Success": "#3e8635",
  "SuccessBackground": "var(--pf-global--success-color--200)",
  "Warning": "var(--pf-global--warning-color--100)",
  "White": "var(--pf-global--palette--white)",
}
`);
  });
});

// Tests that the function does not overwrite an already defined pfcolorvals object. tags: [happy path]
test('test_defined_PFColorVals', () => {
  // Arrange
  const element = document.createElement('div');
  const PFColorVals = { test: 'value' };

  // Act
  setPFColorVals(element);

  // Assert
  expect(PFColorVals).toEqual({ test: 'value' });
});
// Tests that the function does not modify any variables or objects outside of pfcolorvals. tags: [general behavior]
test('test_no_side_effects', () => {
  // Arrange
  const element = document.createElement('div');
  const initialPFColorVals = { test: 'value' };
  const expectedPFColorVals = {
    Black100: '',
    Black150: '',
    Black200: '',
    Black300: '',
    Black500: '',
    Black600: '',
    Black700: '',
    Black1000: '',
    Blue50: '',
    Blue300: '',
    Blue600: '',
    Gold400: '',
    Green400: '',
    Purple200: '',
    White: '',
    Danger: '',
    Success: '#3E8635',
    Warning: ''
  };
  Object.assign(PFColorVals, initialPFColorVals);

  // Act
  setPFColorVals(element);

  // Assert
  expect(PFColorVals).toEqual(expectedPFColorVals);
  expect(initialPFColorVals).toEqual({ test: 'value' });
});

// Tests that the function sets the corresponding color variable to an empty string when a css variable is not defined. tags: [edge case]
test('test_missing_CSS_variable', () => {
  // Arrange
  const element = document.createElement('div');
  const expectedPFColorVals = {
    Black100: '',
    Black150: '',
    Black200: '',
    Black300: '',
    Black500: '',
    Black600: '',
    Black700: '',
    Black1000: '',
    Blue50: '',
    Blue300: '',
    Blue600: '',
    Gold400: '',
    Green400: '',
    Purple200: '',
    White: '',
    Danger: '',
    Success: '#3E8635',
    Warning: ''
  };

  // Act
  setPFColorVals(element);

  // Assert
  expect(PFColorVals).toEqual(expectedPFColorVals);
});
