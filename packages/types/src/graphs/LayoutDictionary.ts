import { Layout } from '../types/Graph';
import { KialiDagreGraph } from './KialiDagreGraph';
import { KialiGridGraph } from './KialiGridGraph';
import { KialiConcentricGraph } from './KialiConcentricGraph';
import { KialiBreadthFirstGraph } from './KialiBreadthFirstGraph';

const LayoutMap = {
  'kiali-breadthfirst': KialiBreadthFirstGraph.getLayout(),
  'kiali-dagre': KialiDagreGraph.getLayout(),
  'kiali-grid': KialiGridGraph.getLayout(),
  'kiali-concentric': KialiConcentricGraph.getLayout()
};

const getLayout = (layout: Layout) =>
  Object.prototype.hasOwnProperty.call(LayoutMap, layout.name) ? LayoutMap[layout.name] : LayoutMap['kiali-dagre'];

const getLayoutByName = (layoutName: string) =>
  Object.prototype.hasOwnProperty.call(LayoutMap, layoutName) ? LayoutMap[layoutName] : LayoutMap['kiali-dagre'];

export { getLayout, getLayoutByName };
