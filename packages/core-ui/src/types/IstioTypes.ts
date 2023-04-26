import { PFBadges, PFBadgeType } from '../components/Pf';

type istioConfigType = {
  name: string;
  url: string;
  badge: PFBadgeType;
};

export const IstioTypes = {
  gateway: { name: 'Gateway', url: 'gateways', badge: PFBadges.Gateway } as istioConfigType,
  httproute: { name: 'HTTPRoute', url: 'k8shttproutes', badge: PFBadges.HTTPRoute } as istioConfigType,
  k8sgateway: { name: 'Gateway (K8s)', url: 'k8sgateways', badge: PFBadges.K8sGateway } as istioConfigType,
  k8shttproute: { name: 'HTTPRoute (K8s)', url: 'k8shttproutes', badge: PFBadges.K8sHTTPRoute } as istioConfigType,
  virtualservice: { name: 'VirtualService', url: 'virtualservices', badge: PFBadges.VirtualService } as istioConfigType,
  destinationrule: {
    name: 'DestinationRule',
    url: 'destinationrules',
    badge: PFBadges.DestinationRule
  } as istioConfigType,
  serviceentry: { name: 'ServiceEntry', url: 'serviceentries', badge: PFBadges.ServiceEntry } as istioConfigType,
  rule: { name: 'Rule', url: 'rules', badge: PFBadges.Rule } as istioConfigType,
  adapter: { name: 'Adapter', url: 'adapters', badge: PFBadges.Adapter } as istioConfigType,
  template: { name: 'Template', url: 'templates', badge: PFBadges.Template } as istioConfigType,
  instance: { name: 'Instance', url: 'instances', badge: PFBadges.Instance } as istioConfigType,
  handler: { name: 'Handler', url: 'handlers', badge: PFBadges.Handler } as istioConfigType,
  policy: { name: 'Policy', url: 'policies', badge: PFBadges.Policy } as istioConfigType,
  meshpolicy: { name: 'MeshPolicy', url: 'meshpolicies', badge: PFBadges.MeshPolicy } as istioConfigType,
  clusterrbacconfig: {
    name: 'ClusterRbacConfig',
    url: 'clusterrbacconfigs',
    badge: PFBadges.ClusterRBACConfig
  } as istioConfigType,
  rbacconfig: { name: 'RbacConfig', url: 'rbacconfigs', badge: PFBadges.RBACConfig } as istioConfigType,
  authorizationpolicy: {
    name: 'AuthorizationPolicy',
    url: 'authorizationpolicies',
    badge: PFBadges.AuthorizationPolicy
  } as istioConfigType,
  sidecar: { name: 'Sidecar', url: 'sidecars', badge: PFBadges.Sidecar } as istioConfigType,
  servicerole: { name: 'ServiceRole', url: 'serviceroles', icon: PFBadges.ServiceRole },
  servicerolebinding: {
    name: 'ServiceRoleBinding',
    url: 'servicerolebindings',
    badge: PFBadges.ServiceRoleBinding
  } as istioConfigType,
  peerauthentication: {
    name: 'PeerAuthentication',
    url: 'peerauthentications',
    badge: PFBadges.PeerAuthentication
  } as istioConfigType,
  requestauthentication: {
    name: 'RequestAuthentication',
    url: 'requestauthentications',
    badge: PFBadges.RequestAuthentication
  } as istioConfigType,
  workloadentry: { name: 'WorkloadEntry', url: 'workloadentries', badge: PFBadges.WorkloadEntry } as istioConfigType,
  workloadgroup: { name: 'WorkloadGroup', url: 'workloadgroups', badge: PFBadges.WorkloadGroup } as istioConfigType,
  envoyfilter: { name: 'EnvoyFilter', url: 'envoyfilters', badge: PFBadges.EnvoyFilter } as istioConfigType,
  wasmplugin: { name: 'WasmPlugin', url: 'wasmplugins', badge: PFBadges.WasmPlugin } as istioConfigType,
  telemetry: { name: 'Telemetry', url: 'telemetries', badge: PFBadges.Telemetry } as istioConfigType,
  attributemanifest: {
    name: 'AttributeManifest',
    url: 'attributemanifests',
    badge: PFBadges.AttributeManifest
  } as istioConfigType
};
