import * as React from 'react';
import { Text, TextVariants } from '@patternfly/react-core';
import { severitySummary, ValidationSummaryProps } from './Helper';
import { getKialiStyle } from '@kiali/core-ui';

const tooltipListStyle = getKialiStyle({
  textAlign: 'left',
  border: 0,
  padding: '0 0 0 0',
  margin: '0 0 0 0'
});

export const ServiceValidationSummary = (props: ValidationSummaryProps) => {
  return (
    <>
      <Text style={{ textAlign: 'left', textEmphasis: 'strong' }} component={TextVariants.p}>
        Service validation result
      </Text>
      <div className={tooltipListStyle}>
        {severitySummary(props.warnings, props.errors).map(cat => (
          <div key={cat}>{cat}</div>
        ))}
      </div>
    </>
  );
};
