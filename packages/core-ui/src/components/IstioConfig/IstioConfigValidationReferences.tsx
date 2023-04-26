import { Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import * as React from 'react';
import { ObjectReference } from '@kiali/types';

interface IstioConfigReferencesProps {
  objectReferences: ObjectReference[];
  linkTemplate: (name: string, namespace: string, objectType: string) => JSX.Element;
}

export class IstioConfigValidationReferences extends React.Component<IstioConfigReferencesProps> {
  render() {
    return (
      <Stack>
        <StackItem>
          <Title headingLevel="h5" size={TitleSizes.lg} style={{ paddingBottom: '10px' }}>
            Validation References
          </Title>
        </StackItem>

        {this.props.objectReferences &&
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
