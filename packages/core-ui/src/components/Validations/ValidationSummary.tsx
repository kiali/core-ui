import * as React from 'react';
import { ValidationTypes } from '@kiali/types';
import { Text, TextVariants, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { Validation } from './Validation';
import { severitySummary, ValidationSummaryProps } from './Helper';
import { getKialiStyle } from '../../utils/StyleUtils';

const tooltipListStyle = getKialiStyle({
  textAlign: 'left',
  border: 0,
  padding: '0 0 0 0',
  margin: '0 0 0 0'
});

const tooltipSentenceStyle = getKialiStyle({
  textAlign: 'center',
  border: 0,
  padding: '0 0 0 0',
  margin: '0 0 0 0'
});

export const ValidationSummary = (props: ValidationSummaryProps) => {
  const severity = () => {
    let severity = ValidationTypes.Correct;
    if (props.errors > 0) {
      severity = ValidationTypes.Error;
    } else if (props.warnings > 0) {
      severity = ValidationTypes.Warning;
    }

    return severity;
  };

  const tooltipNA = () => {
    return <Text className={tooltipSentenceStyle}>No Istio config objects found</Text>;
  };

  const tooltipNoValidationAvailable = () => {
    return <Text className={tooltipListStyle}>No Istio config validation available</Text>;
  };

  const tooltipSummary = () => {
    return (
      <>
        <Text style={{ textAlign: 'left', textEmphasis: 'strong' }} component={TextVariants.p}>
          Istio config objects analyzed: {props.objectCount}
        </Text>
        <div className={tooltipListStyle}>
          {severitySummary(props.warnings, props.errors).map(cat => (
            <div key={cat}>{cat}</div>
          ))}
        </div>
        {props.reconciledCondition?.status && (
          <Text style={{ textAlign: 'left', textEmphasis: 'strong' }} component={TextVariants.p}>
            The object is reconciled
          </Text>
        )}
      </>
    );
  };

  const tooltipContent = () => {
    if (props.objectCount !== undefined) {
      if (props.objectCount === 0) {
        return tooltipNA();
      } else {
        return tooltipSummary();
      }
    } else {
      return tooltipNoValidationAvailable();
    }
  };

  const tooltipBase = () => {
    return props.objectCount === undefined || props.objectCount > 0 ? (
      <Validation iconStyle={props.style} severity={severity()} />
    ) : (
      <div style={{ display: 'inline-block', marginLeft: '5px' }}>N/A</div>
    );
  };

  return (
    <Tooltip
      aria-label={'Validations list'}
      position={TooltipPosition.auto}
      enableFlip={true}
      content={tooltipContent()}
    >
      {tooltipBase()}
    </Tooltip>
  );
};
