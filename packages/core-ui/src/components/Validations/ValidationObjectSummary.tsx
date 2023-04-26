import React from 'react';
import { ObjectValidation, StatusCondition, ValidationTypes } from '@kiali/types';
import { ValidationSummary } from './ValidationSummary';

interface ValidationObjectSummaryProps {
  id: string;
  validations: ObjectValidation[];
  reconciledCondition?: StatusCondition;
  style?: React.CSSProperties;
}

export const ValidationObjectSummary = (props: ValidationObjectSummaryProps) => {
  const numberOfChecks = (type: ValidationTypes) => {
    let numCheck = 0;
    props.validations.forEach(validation => {
      if (validation.checks) {
        numCheck += validation.checks.filter(i => i.severity === type).length;
      }
    });
    return numCheck;
  };

  return (
    <ValidationSummary
      id={props.id}
      objectCount={1}
      errors={numberOfChecks(ValidationTypes.Error)}
      warnings={numberOfChecks(ValidationTypes.Warning)}
      reconciledCondition={props.reconciledCondition}
      style={props.style}
    />
  );
};
