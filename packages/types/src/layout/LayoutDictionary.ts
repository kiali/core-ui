import { KialiDagreGraph } from './KialiDagreGraph';
import { KialiGridGraph } from './KialiGridGraph';
import { KialiConcentricGraph } from './KialiConcentricGraph';
import { KialiBreadthFirstGraph } from './KialiBreadthFirstGraph';
import { Layout } from '../types';

const LayoutMap = {
  'kiali-breadthfirst': KialiBreadthFirstGraph.getLayout(),
  'kiali-dagre': KialiDagreGraph.getLayout(),
  'kiali-grid': KialiGridGraph.getLayout(),
  'kiali-concentric': KialiConcentricGraph.getLayout()
};

const getLayout = (layout: Layout) =>
  Object.hasOwnProperty.call(LayoutMap, layout.name) ? LayoutMap[layout.name] : LayoutMap['kiali-dagre'];

const getLayoutByName = (layoutName: string) =>
  Object.hasOwnProperty.call(LayoutMap, layoutName) ? LayoutMap[layoutName] : LayoutMap['kiali-dagre'];

export { getLayout, getLayoutByName };
