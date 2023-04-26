import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon
} from '@patternfly/react-icons';
import { Text, TextVariants } from '@patternfly/react-core';
import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import { PFColors, ValidationTypes } from '@kiali/types';
import { getKialiStyle } from '../../utils/StyleUtils';

const validationStyle = getKialiStyle({
  textAlign: 'left',
  $nest: {
    '&:last-child p': {
      margin: 0
    }
  }
});

type ValidationProps = ValidationDescription & {
  messageColor?: boolean;
  textStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
};

type ValidationDescription = {
  severity: ValidationTypes;
  message?: string;
};

type ValidationType = {
  name: string;
  color: string;
  icon: React.ComponentClass<SVGIconProps>;
};

const ErrorValidation: ValidationType = {
  name: 'Not Valid',
  color: PFColors.Danger,
  icon: ExclamationCircleIcon
};

const WarningValidation: ValidationType = {
  name: 'Warning',
  color: PFColors.Warning,
  icon: ExclamationTriangleIcon
};

const InfoValidation: ValidationType = {
  name: 'Info',
  color: PFColors.Info,
  icon: InfoCircleIcon
};

const CorrectValidation: ValidationType = {
  name: 'Valid',
  color: PFColors.Success,
  icon: CheckCircleIcon
};

const severityToValidation: { [severity: string]: ValidationType } = {
  error: ErrorValidation,
  warning: WarningValidation,
  correct: CorrectValidation,
  info: InfoValidation
};

export const Validation = (props: ValidationProps) => {
  const validation = () => {
    return severityToValidation[props.severity];
  };

  const severityColor = () => {
    return { color: validation().color };
  };

  const textStyle = (): React.CSSProperties => {
    const colorMessage = props.messageColor || false;
    const textStyle = props.textStyle || {};
    if (colorMessage) {
      Object.assign(textStyle, severityColor());
    }
    return textStyle;
  };

  const iconStyle = (): React.CSSProperties => {
    const iconStyle = props.iconStyle ? { ...props.iconStyle } : {};
    const defaultStyle: React.CSSProperties = {
      verticalAlign: '-0.125em'
    };
    Object.assign(iconStyle, severityColor());
    Object.assign(iconStyle, defaultStyle);
    return iconStyle;
  };

  const validationItem = validation();

  const IconComponent = validationItem.icon;

  const hasMessage = !!props.message;

  if (hasMessage) {
    return (
      <div className={validationStyle}>
        <Text component={TextVariants.p} style={textStyle()}>
          <IconComponent style={iconStyle()} /> {props.message}
        </Text>
      </div>
    );
  } else {
    return <IconComponent style={iconStyle()} />;
  }
};
