import { DecoratedGraphEdgeData, DecoratedGraphNodeData } from '../types';
import * as Cy from 'cytoscape';

export const decoratedEdgeData = (ele: Cy.EdgeSingular): DecoratedGraphEdgeData => {
  return ele.data();
};

export const decoratedNodeData = (ele: Cy.NodeSingular): DecoratedGraphNodeData => {
  return ele.data();
};

export const toSafeCyFieldName = (fieldName: string): string => {
  const alnumString = /^[a-zA-Z0-9]*$/;
  const unsafeChar = /[^a-zA-Z0-9]/g;

  if (fieldName.match(alnumString)) {
    return fieldName;
  }

  return fieldName.replace(unsafeChar, '_');
};
