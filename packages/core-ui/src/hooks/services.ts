import * as React from 'react';
import {
  CancelablePromise,
  DurationInSeconds,
  TimeInMilliseconds,
  ServiceDetailsInfo,
  getGatewaysAsList,
  PeerAuthentication,
  DecoratedGraphNodeData,
  NodeType,
  getServiceDetail,
  getAllIstioConfigs,
  getIstioConfig,
  ComputedServerConfig
} from '@kiali/types';
import { AxiosError } from 'axios';
// import * as AlertUtils from '../utils/AlertUtils';
import { useState } from 'react';

export function useServiceDetail(
  serverConfig: ComputedServerConfig,
  namespace: string,
  serviceName: string,
  cluster?: string | undefined,
  duration?: DurationInSeconds,
  updateTime?: TimeInMilliseconds
) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<AxiosError | null>(null);

  const [serviceDetails, setServiceDetails] = React.useState<ServiceDetailsInfo | null>(null);
  const [gateways, setGateways] = React.useState<string[] | null>(null);
  const [peerAuthentications, setPeerAuthentications] = React.useState<PeerAuthentication[] | null>(null);

  React.useEffect(() => {
    if (namespace.length === 0 || serviceName.length === 0) {
      return;
    }

    setIsLoading(true); // Mark as loading
    let getDetailPromise = getServiceDetail(serverConfig, namespace, serviceName, false, duration);
    let getGwPromise = getAllIstioConfigs([], ['gateways'], false, '', '');
    let getPeerAuthsPromise = getIstioConfig(namespace, ['peerauthentications'], false, '', '');

    const allPromise = new CancelablePromise(Promise.all([getDetailPromise, getGwPromise, getPeerAuthsPromise]));
    allPromise.promise
      .then(results => {
        setServiceDetails(results[0]);
        setGateways(
          Object.values(results[1].data)
            .map(nsCfg => getGatewaysAsList(nsCfg.gateways))
            .flat()
            .sort()
        );
        setPeerAuthentications(results[2].data.peerAuthentications);
        setFetchError(null);
        setIsLoading(false);
      })
      .catch(error => {
        if (error.isCanceled) {
          return;
        }
        setFetchError(error);
        setIsLoading(false);
      });

    return function () {
      // Cancel the promise, just in case there is still some ongoing request
      // after the component is unmounted.
      allPromise.cancel();
      setIsLoading(false);

      // Reset state
      setServiceDetails(null);
      setGateways(null);
      setPeerAuthentications(null);
    };
  }, [namespace, serviceName, cluster, duration, updateTime, serverConfig]);

  return [serviceDetails, gateways, peerAuthentications, isLoading, fetchError] as const;
}

export function useServiceDetailForGraphNode(
  serverConfig: ComputedServerConfig,
  node: DecoratedGraphNodeData,
  loadFlag: boolean,
  duration?: DurationInSeconds,
  updateTime?: TimeInMilliseconds
) {
  const [nodeNamespace, setNodeNamespace] = useState<string>('');
  const [nodeSvcName, setNodeSvcName] = useState<string>('');
  const [usedDuration, setUsedDuration] = useState<DurationInSeconds | undefined>(undefined);
  const [usedUpdateTime, setUsedUpdateTime] = useState<TimeInMilliseconds | undefined>(undefined);

  React.useEffect(() => {
    if (!loadFlag) {
      return;
    }

    const localSvc = node.nodeType === NodeType.SERVICE && node.service && !node.isServiceEntry ? node.service : '';

    setNodeNamespace(node.namespace);
    setNodeSvcName(localSvc);
    setUsedDuration(duration);
    setUsedUpdateTime(updateTime);
  }, [loadFlag, node, duration, updateTime]);

  const result = useServiceDetail(serverConfig, nodeNamespace, nodeSvcName, node.cluster, usedDuration, usedUpdateTime);

  const fetchError = result[4];
  React.useEffect(() => {
    if (fetchError !== null) {
      console.error('Could not fetch Service Details.');
      // AlertUtils.addError('Could not fetch Service Details.', fetchError);
    }
  }, [fetchError]);

  return result;
}
