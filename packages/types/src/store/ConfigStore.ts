import { createStore, applyMiddleware, compose, Store } from 'redux';
import { KialiAppState } from './Store';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { persistFilter } from 'redux-persist-transform-filter';
import { createTransform } from 'redux-persist';

import { rootReducer } from '../reducers';
import thunk from 'redux-thunk';

// defaults to localStorage for web and AsyncStorage for react-native
import storage from 'redux-persist/lib/storage';
import { INITIAL_GLOBAL_STATE } from '../reducers/GlobalState';
import { INITIAL_LOGIN_STATE } from '../reducers/LoginState';
import { INITIAL_GRAPH_STATE } from '../reducers/GraphDataState';
import { INITIAL_USER_SETTINGS_STATE } from '../reducers/UserSettingsState';
import { INITIAL_MESSAGE_CENTER_STATE } from '../reducers/MessageCenter';
import { INITIAL_STATUS_STATE } from '../reducers/HelpDropdownState';
import { INITIAL_NAMESPACE_STATE } from '../reducers/NamespaceState';
import { INITIAL_JAEGER_STATE } from '../reducers/JaegerState';
import { INITIAL_MESH_TLS_STATE } from '../reducers/MeshTlsState';
import { INITIAL_TOUR_STATE } from '../reducers/TourState';
import { INITIAL_ISTIO_STATUS_STATE } from '../reducers/IstioStatusState';
import { INITIAL_METRICS_STATS_STATE } from '../reducers/MetricsStatsState';
import { INITIAL_ISTIO_CERTS_INFO_STATE } from '../reducers/IstioCertsInfoState';
import { KialiAppAction } from '../actions/KialiAppAction';

declare const window;

const webRoot = (window as any).WEB_ROOT ? (window as any).WEB_ROOT : undefined;
const persistKey = 'kiali-' + (webRoot && webRoot !== '/' ? webRoot.substring(1) : 'root');

// Needed to be able to whitelist fields but allowing to keep an initialState
const whitelistInputWithInitialState = (reducerName: string, inboundPaths: string[], initialState: any) =>
  createTransform(
    inboundState => persistFilter(inboundState, inboundPaths, 'whitelist'),
    outboundState => ({ ...initialState, ...outboundState }),
    { whitelist: [reducerName] }
  );

const authenticationPersistFilter = whitelistInputWithInitialState(
  'authentication',
  ['landingRoute'],
  INITIAL_LOGIN_STATE
);

const namespacePersistFilter = whitelistInputWithInitialState(
  'namespaces',
  ['activeNamespaces'],
  INITIAL_NAMESPACE_STATE
);

const graphPersistFilter = whitelistInputWithInitialState('graph', ['filterState', 'layout'], INITIAL_GRAPH_STATE);

const userSettingsPersitFilter = whitelistInputWithInitialState(
  'userSettings',
  ['duration', 'refreshInterval', 'timeRange'],
  INITIAL_USER_SETTINGS_STATE
);

const persistConfig = {
  key: persistKey,
  storage: storage,
  whitelist: ['authentication', 'graph', 'jaegerState', 'namespaces', 'statusState', 'userSettings'],
  transforms: [authenticationPersistFilter, graphPersistFilter, namespacePersistFilter, userSettingsPersitFilter]
};

const composeEnhancers =
  (process.env.NODE_ENV === 'development' && window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const configureStore = (initialState: KialiAppState): Store<KialiAppState, KialiAppAction> => {
  // configure middlewares
  const middlewares = [thunk];
  // compose enhancers
  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  // persist reducers
  const persistentReducer = persistReducer(persistConfig, rootReducer);

  return createStore(persistentReducer, initialState, enhancer);
};

// Setup the initial state of the Redux store with defaults
// (instead of having things be undefined until they are populated by query)
// Redux 4.0 actually required this
const initialStore: KialiAppState = {
  globalState: INITIAL_GLOBAL_STATE,
  statusState: INITIAL_STATUS_STATE,
  namespaces: INITIAL_NAMESPACE_STATE,
  authentication: INITIAL_LOGIN_STATE,
  messageCenter: INITIAL_MESSAGE_CENTER_STATE,
  graph: INITIAL_GRAPH_STATE,
  userSettings: INITIAL_USER_SETTINGS_STATE,
  jaegerState: INITIAL_JAEGER_STATE,
  meshTLSStatus: INITIAL_MESH_TLS_STATE,
  metricsStats: INITIAL_METRICS_STATS_STATE,
  istioStatus: INITIAL_ISTIO_STATUS_STATE,
  istioCertsInfo: INITIAL_ISTIO_CERTS_INFO_STATE,
  tourState: INITIAL_TOUR_STATE
};

// pass an optional param to rehydrate state on app start
export const store = configureStore(initialStore);
export const persistor = persistStore(store);
export { PersistGate };
