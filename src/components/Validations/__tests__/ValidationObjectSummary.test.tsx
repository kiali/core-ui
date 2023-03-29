import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ObjectValidation, StatusCondition, ValidationTypes } from '../../../types';
import { ValidationObjectSummary } from '../ValidationObjectSummary';

const mockValidationObjectSummary = (
  validations: ObjectValidation[],
  reconciledCondition?: StatusCondition,
  style?: React.CSSProperties
) => {
  return (
    <ValidationObjectSummary
      id={'validation-object-summary'}
      validations={validations}
      reconciledCondition={reconciledCondition}
      style={style}
    />
  );
};

const mockObjectValidation = (severity: ValidationTypes): ObjectValidation => {
  return {
    name: 'test',
    objectType: 'virtualservice',
    valid: true,
    checks: [
      {
        message: 'correct',
        severity: severity,
        path: 'test'
      }
    ]
  };
};

describe('ValidationObjectSummary', () => {
  test('Renders with no issues', async () => {
    const objectValidation = [mockObjectValidation(ValidationTypes.Correct)];
    const { asFragment, container, getByRole } = render(mockValidationObjectSummary(objectValidation));
    expect(asFragment()).toMatchSnapshot();
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent('Istio config objects analyzed: 1No issues found');
    });
  });

  test('Renders with errors', async () => {
    const objectValidation = [mockObjectValidation(ValidationTypes.Error)];
    const { asFragment, container, getByRole } = render(mockValidationObjectSummary(objectValidation));
    expect(asFragment()).toMatchSnapshot();
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent('Istio config objects analyzed: 11 error found');
    });
  });

  test('Renders with warnings', async () => {
    const objectValidation = [mockObjectValidation(ValidationTypes.Warning)];
    const { asFragment, container, getByRole } = render(mockValidationObjectSummary(objectValidation));
    expect(asFragment()).toMatchSnapshot();
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent('Istio config objects analyzed: 11 warning found');
    });
  });

  test('Renders with reconciled status', async () => {
    const objectValidation = [mockObjectValidation(ValidationTypes.Correct)];
    const status: StatusCondition = { type: 'Reconciled', status: true, message: 'Reconciled object' };
    const { container, getByRole } = render(mockValidationObjectSummary(objectValidation, status));
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent(
        'Istio config objects analyzed: 1No issues foundThe object is reconciled'
      );
    });
  });
});
