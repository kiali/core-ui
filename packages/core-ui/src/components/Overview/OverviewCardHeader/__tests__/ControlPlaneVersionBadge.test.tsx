import React from 'react';
import { render } from '@testing-library/react';

import { ControlPlaneVersionBadge } from '../ControlPlaneVersionBadge';

const mockControlPlaneVersionBadge = (version: string = '1.0', canary: boolean = true) => {
  return <ControlPlaneVersionBadge version={version} isCanary={canary} />;
};

describe('ControlPlaneVersionBadge', () => {
  test('Renders with canary', () => {
    const { asFragment, container, getByText } = render(mockControlPlaneVersionBadge('1.0', true));
    expect(asFragment()).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('pf-m-blue');
    const versionElement = getByText('1.0');
    expect(versionElement).toBeVisible();
    expect(versionElement).toHaveClass('pf-c-label__content');
  });

  test('Renders without canary', () => {
    const { asFragment, container, getByText } = render(mockControlPlaneVersionBadge('1.0', false));
    expect(asFragment()).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('pf-m-orange');
    const versionElement = getByText('1.0');
    expect(versionElement).toBeVisible();
    expect(versionElement).toHaveClass('pf-c-label__content');
  });
});
