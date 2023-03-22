import { DecoratedGraphEdgeData, DecoratedGraphNodeData } from '../types';
import * as Cy from 'cytoscape';

export const decoratedEdgeData = (ele: Cy.EdgeSingular): DecoratedGraphEdgeData => {
  return ele.data();
};

export const decoratedNodeData = (ele: Cy.NodeSingular): DecoratedGraphNodeData => {
  return ele.data();
};
