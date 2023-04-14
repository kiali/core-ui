import { Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import { ReferenceIstioObjectLink } from '../Link/IstioObjectLink';
import * as React from 'react';
import { ObjectReference } from '@kiali/types';

interface IstioConfigReferencesProps {
  objectReferences: ObjectReference[];
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
              <StackItem>
                <ReferenceIstioObjectLink
                  name={reference.name}
                  namespace={reference.namespace}
                  type={reference.objectType}
                />
              </StackItem>
            );
          })}
      </Stack>
    );
  }
}
