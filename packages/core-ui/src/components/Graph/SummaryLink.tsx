import * as React from 'react';
import {
  NodeType,
  GraphNodeData,
  DestService,
  BoxByType,
  CLUSTER_DEFAULT,
  Health,
  ComputedServerConfig
} from '@kiali/types';
import { CyNode, decoratedNodeData } from '../../components/CytoscapeGraph/CytoscapeGraphUtils';
import { KialiIcon } from '../../config/KialiIcon';
import { Badge, PopoverPosition } from '@patternfly/react-core';
import { HealthIndicator } from '../Health/HealthIndicator';
import { PFBadge, PFBadges } from '../Pf/PfBadges';
// import { serverConfig } from 'config';
// import KialiPageLinkContainer from '../Link/KialiPageLink';

interface LinkInfo {
  link: string;
  displayName: string;
  key: string;
}

const getTooltip = (
  serverConfig: ComputedServerConfig,
  tooltip: React.ReactFragment,
  nodeData: GraphNodeData
): React.ReactFragment => {
  const addNamespace = nodeData.isBox !== BoxByType.NAMESPACE;
  const addCluster =
    nodeData.isBox !== BoxByType.CLUSTER &&
    nodeData.cluster !== CLUSTER_DEFAULT &&
    serverConfig?.clusterInfo?.name !== nodeData.cluster;
  return (
    <div style={{ textAlign: 'left' }}>
      <span>{tooltip}</span>
      {addNamespace && <div>{`Namespace: ${nodeData.namespace}`}</div>}
      {addCluster && <div>{`Cluster: ${nodeData.cluster}`}</div>}
    </div>
  );
};

export const getBadge = (serverConfig: ComputedServerConfig, nodeData: GraphNodeData, nodeType?: NodeType) => {
  switch (nodeType || nodeData.nodeType) {
    case NodeType.AGGREGATE:
      return (
        <PFBadge
          badge={PFBadges.Operation}
          size="sm"
          tooltip={getTooltip(serverConfig, `Operation: ${nodeData.aggregate!}`, nodeData)}
        />
      );
    case NodeType.APP:
      return <PFBadge badge={PFBadges.App} size="sm" tooltip={getTooltip(serverConfig, PFBadges.App.tt!, nodeData)} />;
    case NodeType.BOX:
      switch (nodeData.isBox) {
        case BoxByType.APP:
          return (
            <PFBadge badge={PFBadges.App} size="sm" tooltip={getTooltip(serverConfig, PFBadges.App.tt!, nodeData)} />
          );
        case BoxByType.CLUSTER:
          return (
            <PFBadge
              badge={PFBadges.Cluster}
              size="sm"
              tooltip={getTooltip(serverConfig, PFBadges.Cluster.tt!, nodeData)}
            />
          );
        case BoxByType.NAMESPACE:
          return (
            <PFBadge
              badge={PFBadges.Namespace}
              size="sm"
              tooltip={getTooltip(serverConfig, PFBadges.Namespace.tt!, nodeData)}
            />
          );
        default:
          return <PFBadge badge={PFBadges.Unknown} size="sm" />;
      }
    case NodeType.SERVICE:
      return nodeData.isServiceEntry ? (
        <PFBadge
          badge={PFBadges.ServiceEntry}
          size="sm"
          tooltip={getTooltip(
            serverConfig,
            nodeData.isServiceEntry.location === 'MESH_EXTERNAL' ? 'External Service Entry' : 'Internal Service Entry',
            nodeData
          )}
        />
      ) : (
        <PFBadge
          badge={PFBadges.Service}
          size="sm"
          tooltip={getTooltip(serverConfig, PFBadges.Service.tt!, nodeData)}
        />
      );
    case NodeType.WORKLOAD:
      return nodeData.hasWorkloadEntry ? (
        <PFBadge
          badge={PFBadges.WorkloadEntry}
          size="sm"
          tooltip={getTooltip(serverConfig, PFBadges.WorkloadEntry.tt!, nodeData)}
        />
      ) : (
        <PFBadge
          badge={PFBadges.Workload}
          size="sm"
          tooltip={getTooltip(serverConfig, PFBadges.Workload.tt!, nodeData)}
        />
      );
    default:
      return <PFBadge badge={PFBadges.Unknown} size="sm" />;
  }
};

export const getLink = (nodeData: GraphNodeData, nodeType?: NodeType, linkGenerator?: () => LinkInfo) => {
  const { app, cluster, namespace, service, workload } = nodeData;
  if (!nodeType || nodeData.nodeType === NodeType.UNKNOWN) {
    nodeType = nodeData.nodeType;
  }
  let displayName: string = 'unknown';
  let link: string | undefined;
  let key: string | undefined;

  if (linkGenerator) {
    ({ displayName, link, key } = linkGenerator());
  } else {
    switch (nodeType) {
      case NodeType.AGGREGATE:
        displayName = nodeData.aggregateValue!;
        break;
      case NodeType.APP:
        link = `/namespaces/${encodeURIComponent(namespace)}/applications/${encodeURIComponent(app!)}`;
        key = `${namespace}.app.${app}`;
        displayName = app!;
        break;
      case NodeType.BOX:
        switch (nodeData.isBox) {
          case BoxByType.APP:
            link = `/namespaces/${encodeURIComponent(namespace)}/applications/${encodeURIComponent(app!)}`;
            key = `${namespace}.app.${app}`;
            displayName = app!;
            break;
          case BoxByType.CLUSTER:
            displayName = cluster;
            break;
          case BoxByType.NAMESPACE:
            displayName = namespace;
            break;
        }
        break;
      case NodeType.SERVICE:
        if (nodeData.isServiceEntry) {
          link = `/namespaces/${encodeURIComponent(
            nodeData.isServiceEntry.namespace
          )}/istio/serviceentries/${encodeURIComponent(service!)}`;
        } else {
          link = `/namespaces/${encodeURIComponent(namespace)}/services/${encodeURIComponent(service!)}`;
        }
        key = `${namespace}.svc.${service}`;
        displayName = service!;
        break;
      case NodeType.WORKLOAD:
        link = `/namespaces/${encodeURIComponent(namespace)}/workloads/${encodeURIComponent(workload!)}`;
        key = `${namespace}.wl.${workload}`;
        displayName = workload!;
        break;
      default:
        // NOOP
        break;
    }
  }

  if (link && !nodeData.isInaccessible) {
    return (
      // <KialiPageLinkContainer key={key} href={link} cluster={cluster}>
      { displayName }
      // </KialiPageLinkContainer>
    );
  }

  return <span key={key}>{displayName}</span>;
};

export const renderBadgedHost = (host: string) => {
  return (
    <div>
      <PFBadge key={`badgedHost-${host}`} badge={PFBadges.Host} size="sm" />
      {host === '*' ? '* (all hosts)' : host}
    </div>
  );
};

export const renderBadgedName = (serverConfig: ComputedServerConfig, nodeData: GraphNodeData, label?: string) => {
  return (
    <div key={`badgedName-${nodeData.id}`}>
      <span style={{ marginRight: '1em', marginBottom: '3px', display: 'inline-block' }}>
        {label && (
          <span style={{ whiteSpace: 'pre' }}>
            <b>{label}</b>
          </span>
        )}
        {getBadge(serverConfig, nodeData)}
        {getLink({ ...nodeData, isInaccessible: true })}
      </span>
    </div>
  );
};

export const renderBadgedLink = (
  serverConfig: ComputedServerConfig,
  nodeData: GraphNodeData,
  nodeType?: NodeType,
  label?: string,
  linkGenerator?: () => LinkInfo
): React.ReactFragment => {
  const link = getLink(nodeData, nodeType, linkGenerator);

  return (
    <div key={`node-${nodeData.id}`}>
      <span style={{ marginRight: '1em', marginBottom: '3px', display: 'inline-block' }}>
        {label && (
          <span style={{ whiteSpace: 'pre' }}>
            <b>{label}</b>
          </span>
        )}
        {getBadge(serverConfig, nodeData, nodeType)}
        {link}
      </span>
      {nodeData.isInaccessible && <KialiIcon.MtlsLock />}
    </div>
  );
};

export const renderHealth = (serverConfig: ComputedServerConfig, health?: Health) => {
  return (
    <>
      <Badge style={{ fontWeight: 'normal', marginTop: '4px', marginBottom: '4px' }} isRead={true}>
        <span style={{ margin: '3px 3px 1px 0' }}>
          {health ? (
            <HealthIndicator
              id="graph-health-indicator"
              health={health}
              tooltipPlacement={PopoverPosition.left}
              serverConfig={serverConfig}
            />
          ) : (
            'n/a'
          )}
        </span>
        health
      </Badge>
    </>
  );
};

export const renderDestServicesLinks = (serverConfig: ComputedServerConfig, node: any) => {
  const nodeData = decoratedNodeData(node);
  const destServices: DestService[] = node.data(CyNode.destServices);

  const links: any[] = [];
  if (!destServices) {
    return links;
  }

  destServices.forEach(ds => {
    const serviceNodeData: GraphNodeData = {
      id: nodeData.id,
      app: '',
      cluster: ds.cluster,
      isInaccessible: nodeData.isInaccessible,
      isOutside: nodeData.isOutside,
      isRoot: nodeData.isRoot,
      isServiceEntry: nodeData.isServiceEntry,
      namespace: nodeData.isServiceEntry ? nodeData.isServiceEntry.namespace : nodeData.namespace,
      nodeType: NodeType.SERVICE,
      service: ds.name,
      version: '',
      workload: ''
    };
    links.push(renderBadgedLink(serverConfig, serviceNodeData));
  });

  return links;
};
