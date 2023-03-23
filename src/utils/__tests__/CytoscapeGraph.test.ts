import * as Cy from 'cytoscape';
import { decoratedEdgeData, decoratedNodeData } from '../';

describe('decoratedEdgeData', () => {
  // Tests that the function returns the correct data when given a valid input. tags: [happy path]
  test('test_valid_input_returns_correct_data', () => {
    // Arrange
    const ele: Cy.EdgeSingular = {
      data: () => ({
        id: 'edge1',
        source: 'node1',
        target: 'node2',
        weight: 5
      })
    };

    // Act
    const result = decoratedEdgeData(ele);

    // Assert
    expect(result).toEqual({
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      weight: 5
    });
  });
});

describe('decoratedNodeData', () => {
  // Tests that the function returns the correct data when given a valid input. tags: [happy path]
  test('test_valid_input_returns_correct_data', () => {
    // Arrange
    const ele: Cy.NodeSingular = {
      data: () => ({
        id: 'edge1',
        source: 'node1',
        target: 'node2',
        weight: 5
      })
    };

    // Act
    const result = decoratedNodeData(ele);

    // Assert
    expect(result).toEqual({
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      weight: 5
    });
  });
});
