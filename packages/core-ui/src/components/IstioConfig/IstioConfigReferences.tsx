import { Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import * as React from 'react';
<<<<<<< HEAD:packages/core-ui/src/components/IstioConfig/IstioConfigReferences.tsx
import { ObjectReference, ServiceReference, WorkloadReference } from '@kiali/types';
=======
import { ObjectReference, ServiceReference, WorkloadReference } from '../../types/IstioObjects';
>>>>>>> 21ce4d7 (Fix lint errors and enable linkTemplate):src/components/IstioConfig/IstioConfigReferences.tsx

interface IstioConfigReferencesProps {
  objectReferences: ObjectReference[];
  serviceReferences: ServiceReference[];
  workloadReferences: WorkloadReference[];
  isValid: boolean | undefined;
  linkTemplate: (name: string, namespace: string, objectType: string) => JSX.Element;
}

export class IstioConfigReferences extends React.Component<IstioConfigReferencesProps> {
  objectReferencesExists = (): boolean => {
    if (this.props.objectReferences && this.props.objectReferences.length > 0) {
      return true;
    }
    return false;
  };

  serviceReferencesExists = (): boolean => {
    if (this.props.serviceReferences && this.props.serviceReferences.length > 0) {
      return true;
    }
    return false;
  };

  workloadReferencesExists = (): boolean => {
    if (this.props.workloadReferences && this.props.workloadReferences.length > 0) {
      return true;
    }
    return false;
  };

  render() {
    return (
      <Stack>
        <StackItem>
          <Title headingLevel="h5" size={TitleSizes.lg} style={{ paddingBottom: '10px' }}>
            References
          </Title>
        </StackItem>
        {!this.objectReferencesExists() && !this.serviceReferencesExists() && !this.workloadReferencesExists() && (
          <StackItem>No references found for this object.</StackItem>
        )}
        {this.serviceReferencesExists() &&
          this.props.serviceReferences.map(reference => {
            return (
              <StackItem key={'service-' + reference.namespace + '-' + reference.name}>
                {this.props.linkTemplate(reference.name, reference.namespace, 'service')}
              </StackItem>
            );
          })}
        {this.workloadReferencesExists() &&
          this.props.workloadReferences.map(reference => {
            return (
              <StackItem key={'workload-' + reference.namespace + '-' + reference.name}>
                {this.props.linkTemplate(reference.name, reference.namespace, 'workload')}
              </StackItem>
            );
          })}
        {this.objectReferencesExists() &&
          this.props.objectReferences.map(reference => {
            return (
              <StackItem key={'istio-' + reference.namespace + '-' + reference.name}>
                {this.props.linkTemplate(reference.name, reference.namespace, reference.objectType)}
              </StackItem>
            );
          })}
      </Stack>
    );
  }
}
