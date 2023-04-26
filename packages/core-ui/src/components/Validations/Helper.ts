import { CSSProperties } from 'react';
import { StatusCondition, ValidationTypes } from '@kiali/types';

export interface ValidationSummaryProps {
  id: string;
  reconciledCondition?: StatusCondition;
  errors: number;
  warnings: number;
  objectCount?: number;
  style?: CSSProperties;
}
const getTypeMessage = (count: number, type: ValidationTypes): string => {
  return count > 1 ? `${count} ${type}s found` : `${count} ${type} found`;
};

export const severitySummary = (warnings: number, errors: number) => {
  const issuesMessages: string[] = [];

  if (errors > 0) {
    issuesMessages.push(getTypeMessage(errors, ValidationTypes.Error));
  }

  if (warnings > 0) {
    issuesMessages.push(getTypeMessage(warnings, ValidationTypes.Warning));
  }

  if (issuesMessages.length === 0) {
    issuesMessages.push('No issues found');
  }

  return issuesMessages;
};
