export const KIALI_WIZARD_LABEL = 'kiali_wizard';
export const KIALI_RELATED_LABEL = 'kiali_wizard_related';

export const WIZARD_TRAFFIC_SHIFTING = 'traffic_shifting';
export const WIZARD_TCP_TRAFFIC_SHIFTING = 'tcp_traffic_shifting';
export const WIZARD_REQUEST_ROUTING = 'request_routing';
export const WIZARD_FAULT_INJECTION = 'fault_injection';
export const WIZARD_REQUEST_TIMEOUTS = 'request_timeouts';

export const WIZARD_K8S_REQUEST_ROUTING = 'k8s_request_routing';

export const WIZARD_ENABLE_AUTO_INJECTION = 'enable_auto_injection';
export const WIZARD_DISABLE_AUTO_INJECTION = 'disable_auto_injection';
export const WIZARD_REMOVE_AUTO_INJECTION = 'remove_auto_injection';
export const WIZARD_EDIT_ANNOTATIONS = 'edit_annotations';

export const DELETE_TRAFFIC_ROUTING = 'delete_traffic_routing';

export const SERVICE_WIZARD_ACTIONS = [
  WIZARD_REQUEST_ROUTING,
  WIZARD_FAULT_INJECTION,
  WIZARD_TRAFFIC_SHIFTING,
  WIZARD_TCP_TRAFFIC_SHIFTING,
  WIZARD_REQUEST_TIMEOUTS,
  WIZARD_K8S_REQUEST_ROUTING
];

export type WizardAction =
  | 'request_routing'
  | 'fault_injection'
  | 'traffic_shifting'
  | 'tcp_traffic_shifting'
  | 'request_timeouts'
  | 'k8s_request_routing';
export type WizardMode = 'create' | 'update';

export const WIZARD_TITLES = {
  [WIZARD_REQUEST_ROUTING]: 'Request Routing',
  [WIZARD_FAULT_INJECTION]: 'Fault Injection',
  [WIZARD_TRAFFIC_SHIFTING]: 'Traffic Shifting',
  [WIZARD_TCP_TRAFFIC_SHIFTING]: 'TCP Traffic Shifting',
  [WIZARD_REQUEST_TIMEOUTS]: 'Request Timeouts',
  [WIZARD_K8S_REQUEST_ROUTING]: 'K8s Gateway API Routing'
};
