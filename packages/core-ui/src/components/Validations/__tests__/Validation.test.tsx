import React from 'react';
import { render } from '@testing-library/react';

import { Validation } from '../Validation';
import { ValidationTypes } from '@kiali/types';

const mockValidation = (
  severity: ValidationTypes = ValidationTypes.Correct,
  message?: string,
  messageColor?: boolean,
  textStyle?: React.CSSProperties,
  iconStyle?: React.CSSProperties
) => {
  return (
    <Validation
      severity={severity}
      message={message}
      messageColor={messageColor}
      textStyle={textStyle}
      iconStyle={iconStyle}
    />
  );
};

describe('Validation', () => {
  test('Renders with correct severity', () => {
    const { asFragment } = render(mockValidation(ValidationTypes.Correct));
    expect(asFragment()).toMatchSnapshot();
  });

  test('Renders with error severity', () => {
    const { asFragment } = render(mockValidation(ValidationTypes.Error));
    expect(asFragment()).toMatchSnapshot();
  });

  test('Renders with warning severity', () => {
    const { asFragment } = render(mockValidation(ValidationTypes.Warning));
    expect(asFragment()).toMatchSnapshot();
  });

  test('Renders with info severity', () => {
    const { asFragment } = render(mockValidation(ValidationTypes.Info));
    expect(asFragment()).toMatchSnapshot();
  });

  test('Renders with message', () => {
    const { getByText } = render(mockValidation(ValidationTypes.Correct, 'Valid'));
    expect(getByText('Valid')).toBeInTheDocument();
  });

  test('Renders with message color', () => {
    const { getByText } = render(mockValidation(ValidationTypes.Correct, 'Valid', true));
    const element = getByText('Valid');
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle('color: rgb(62, 134, 53);');
  });

  test('Renders with text style', () => {
    const { getByText } = render(mockValidation(ValidationTypes.Correct, 'Valid', false, { fontWeight: 'bold' }));
    const element = getByText('Valid');
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle('fontWeight: bold;');
  });

  test('Renders with icon style', () => {
    const { container } = render(mockValidation(ValidationTypes.Correct, '', false, {}, { fontSize: '20px' }));
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveStyle('fontSize: 20px;');
  });
});
