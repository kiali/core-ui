import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StatusCondition } from '../../../types';
import { ValidationSummary } from '../ValidationSummary';

const mockValidationSummary = (
  errors: number,
  warnings: number,
  objectCount?: number,
  reconciledCondition?: StatusCondition,
  style?: React.CSSProperties
) => {
  return (
    <ValidationSummary
      id={'validation-summary'}
      errors={errors}
      warnings={warnings}
      reconciledCondition={reconciledCondition}
      objectCount={objectCount}
      style={style}
    />
  );
};

describe('ValidationSummary', () => {
  test('Renders with no issues', async () => {
    const { asFragment, container, getByRole } = render(mockValidationSummary(0, 0, 1));
    expect(asFragment()).toMatchSnapshot();
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent('Istio config objects analyzed: 1No issues found');
    });
  });

  test('Renders with errors', async () => {
    const { asFragment, container, getByRole } = render(mockValidationSummary(1, 0, 1));
    expect(asFragment()).toMatchSnapshot();
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent('Istio config objects analyzed: 11 error found');
    });
  });

  test('Renders with warnings', async () => {
    const { asFragment, container, getByRole } = render(mockValidationSummary(0, 1, 1));
    expect(asFragment()).toMatchSnapshot();
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent('Istio config objects analyzed: 11 warning found');
    });
  });

  test('Renders with error and warning', async () => {
    const { asFragment, container, getByRole } = render(mockValidationSummary(1, 1, 2));
    expect(asFragment()).toMatchSnapshot();
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent('Istio config objects analyzed: 21 error found1 warning found');
    });
  });

  test('Renders with multiple errors', async () => {
    const { asFragment, container, getByRole } = render(mockValidationSummary(2, 0, 2));
    expect(asFragment()).toMatchSnapshot();
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent('Istio config objects analyzed: 22 errors found');
    });
  });

  test('Renders with no object counts', async () => {
    const { container, getByText, getByRole } = render(mockValidationSummary(0, 0, 0));
    expect(getByText('N/A')).toBeInTheDocument();
    // No validation icon on the screen
    expect(container.querySelector('svg')).not.toBeInTheDocument();
    userEvent.hover(getByText('N/A'));
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent('No Istio config objects found');
    });
  });

  test('Renders with no available objects', async () => {
    const { asFragment, container, getByRole } = render(mockValidationSummary(0, 0));
    expect(asFragment()).toMatchSnapshot();
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent('No Istio config validation available');
    });
  });

  test('Renders with reconciled status', async () => {
    const status: StatusCondition = { type: 'Reconciled', status: true, message: 'Reconciled object' };
    const { container, getByRole } = render(mockValidationSummary(0, 0, 1, status));
    userEvent.hover(container.querySelector('svg') as Element);
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent(
        'Istio config objects analyzed: 1No issues foundThe object is reconciled'
      );
    });
  });
});
