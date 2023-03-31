import React from 'react';
import { StatusCondition, ValidationTypes } from '../../types/IstioObjects';
import { style } from 'typestyle';
import { Text, TextVariants, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { Validation } from './Validation';

interface ValidationSummaryProps {
  id: string;
  reconciledCondition?: StatusCondition;
  errors: number;
  warnings: number;
  objectCount?: number;
  style?: React.CSSProperties;
}

const tooltipListStyle = style({
  textAlign: 'left',
  border: 0,
  padding: '0 0 0 0',
  margin: '0 0 0 0'
});

const tooltipSentenceStyle = style({
  textAlign: 'center',
  border: 0,
  padding: '0 0 0 0',
  margin: '0 0 0 0'
});

export const ValidationSummary = (props: ValidationSummaryProps) => {
  const getTypeMessage = (count: number, type: ValidationTypes): string => {
    return count > 1 ? `${count} ${type}s found` : `${count} ${type} found`;
  };

  const severitySummary = () => {
    const issuesMessages: string[] = [];

    if (props.errors > 0) {
      issuesMessages.push(getTypeMessage(props.errors, ValidationTypes.Error));
    }

    if (props.warnings > 0) {
      issuesMessages.push(getTypeMessage(props.warnings, ValidationTypes.Warning));
    }

    if (issuesMessages.length === 0) {
      issuesMessages.push('No issues found');
    }

    return issuesMessages;
  };

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
          {severitySummary().map(cat => (
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
