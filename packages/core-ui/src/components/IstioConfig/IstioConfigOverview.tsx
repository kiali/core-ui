import { Stack, StackItem, Title, TitleSizes, Tooltip, TooltipPosition } from '@patternfly/react-core';
import Labels from '../Label/Labels';
import { PFBadge } from '../Pf/PfBadges';
import { ValidationObjectSummary } from '../Validations/ValidationObjectSummary';
import { IstioTypes } from '../../types/IstioTypes';
import { KialiIcon } from '../../config/KialiIcon';
import * as React from 'react';
import {
  getIstioObject,
  getReconciliationCondition,
  HelpMessage,
  IstioConfigDetails,
  ObjectReference,
  ObjectValidation,
  ServiceReference,
  ValidationMessage,
  ValidationTypes,
  WorkloadReference
} from '@kiali/types';
import LocalTime from '../Time/LocalTime';
import { IstioConfigHelp } from './IstioConfigHelp';
import { IstioStatusMessageList } from './IstioStatusMessageList';
import { IstioConfigValidationReferences } from './IstioConfigValidationReferences';
import { IstioConfigReferences } from './IstioConfigReferences';
import { getKialiStyle } from '../../utils';

interface IstioConfigOverviewProps {
  istioObjectDetails: IstioConfigDetails;
  istioValidations?: ObjectValidation;
  namespace: string;
  statusMessages: ValidationMessage[];
  objectReferences: ObjectReference[];
  serviceReferences: ServiceReference[];
  workloadReferences: WorkloadReference[];
  helpMessages?: HelpMessage[];
  selectedLine?: string;
  // kiosk: string;
  istioAPIEnabled: boolean;
  linkTemplate: (name: string, namespace: string, objectType: string) => JSX.Element;
}

const iconStyle = getKialiStyle({
  margin: '0 0 0 0',
  padding: '0 0 0 0',
  display: 'inline-block',
  verticalAlign: '2px !important'
});

const infoStyle = getKialiStyle({
  margin: '0px 0px 2px 10px',
  verticalAlign: '-5px !important'
});

const warnStyle = getKialiStyle({
  margin: '0px 0px 2px 0px',
  verticalAlign: '-3px !important'
});

const healthIconStyle = getKialiStyle({
  marginLeft: '10px',
  verticalAlign: '-1px !important'
});

const resourceListStyle = getKialiStyle({
  margin: '0px 0 11px 0',
  $nest: {
    '& > ul > li > span': {
      float: 'left',
      width: '125px',
      fontWeight: 700
    }
  }
});

export class IstioConfigOverview extends React.Component<IstioConfigOverviewProps> {
  configurationHasWarnings = (): boolean | undefined => {
    return this.props.istioValidations?.checks.some(check => {
      return check.severity === ValidationTypes.Warning;
    });
  };

  render() {
    const istioObject = getIstioObject(this.props.istioObjectDetails);

    const resourceProperties = (
      <div key="properties-list" className={resourceListStyle}>
        <ul style={{ listStyleType: 'none' }}>
          {istioObject && istioObject.metadata.creationTimestamp && (
            <li>
              <span>Created</span>
              <div style={{ display: 'inline-block' }}>
                <LocalTime time={istioObject.metadata.creationTimestamp} />
              </div>
            </li>
          )}
          {istioObject && istioObject.metadata.resourceVersion && (
            <li>
              <span>Version</span>
              {istioObject.metadata.resourceVersion}
            </li>
          )}
        </ul>
      </div>
    );

    return (
      <Stack hasGutter={true}>
        <StackItem>
          <Title headingLevel="h3" size={TitleSizes.xl}>
            Overview
          </Title>
        </StackItem>
        <StackItem>
          {istioObject && istioObject.kind && (
            <>
              <div className={iconStyle}>
                <PFBadge badge={IstioTypes[istioObject.kind?.toLowerCase()].badge} position={TooltipPosition.top} />
              </div>
              {istioObject?.metadata.name}
              <Tooltip
                position={TooltipPosition.right}
                content={<div style={{ textAlign: 'left' }}>{resourceProperties}</div>}
              >
                <KialiIcon.Info className={infoStyle} />
              </Tooltip>
              {this.props.istioValidations &&
                (!this.props.statusMessages || this.props.statusMessages.length === 0) &&
                (!this.props.istioValidations.checks || this.props.istioValidations.checks.length === 0) && (
                  <span className={healthIconStyle}>
                    <ValidationObjectSummary
                      id={'config-validation'}
                      validations={[this.props.istioValidations]}
                      reconciledCondition={getReconciliationCondition(this.props.istioObjectDetails)}
                    />
                  </span>
                )}
            </>
          )}
        </StackItem>

        {istioObject?.metadata.labels && (
          <StackItem>
            <Labels tooltipMessage="Labels defined on this resource" labels={istioObject?.metadata.labels}></Labels>
          </StackItem>
        )}

        {((this.props.statusMessages && this.props.statusMessages.length > 0) ||
          (this.props.istioValidations &&
            this.props.istioValidations.checks &&
            this.props.istioValidations.checks.length > 0)) && (
          <StackItem>
            <IstioStatusMessageList messages={this.props.statusMessages} checks={this.props.istioValidations?.checks} />
          </StackItem>
        )}

        {this.props.istioValidations?.references && (
          <StackItem>
            <IstioConfigValidationReferences
              objectReferences={this.props.istioValidations.references}
              linkTemplate={this.props.linkTemplate}
            />
          </StackItem>
        )}

        {this.props.istioValidations?.valid && !this.configurationHasWarnings() && (
          <StackItem>
            <IstioConfigReferences
              objectReferences={this.props.objectReferences}
              serviceReferences={this.props.serviceReferences}
              workloadReferences={this.props.workloadReferences}
              isValid={this.props.istioValidations?.valid}
              linkTemplate={this.props.linkTemplate}
            />
          </StackItem>
        )}

        {this.props.helpMessages && this.props.helpMessages.length > 0 && (
          <StackItem>
            <IstioConfigHelp
              helpMessages={this.props.helpMessages}
              selectedLine={this.props.selectedLine}
            ></IstioConfigHelp>
          </StackItem>
        )}
        {!this.props.istioAPIEnabled && (
          <StackItem>
            <KialiIcon.Warning className={warnStyle} /> <b>Istio API is disabled.</b> Be careful when editing the
            configuration as the Istio config validations are disabled when the Istio API is disabled.
          </StackItem>
        )}
      </Stack>
    );
  }
}
