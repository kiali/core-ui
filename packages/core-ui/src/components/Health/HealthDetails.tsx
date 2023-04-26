import * as React from 'react';
import { createIcon } from './Helper';
import { InfoAltIcon } from '@patternfly/react-icons';
import './Health.css';
import { Title, TitleSizes } from '@patternfly/react-core';
import {
  ComputedServerConfig,
  DEGRADED,
  FAILURE,
  Health,
  HealthItem,
  HEALTHY,
  PFColors,
  TRAFFICSTATUS
} from '@kiali/types';
import { getKialiStyle } from '../../utils/StyleUtils';

interface Props {
  health: Health;
  serverConfig: ComputedServerConfig;
}

const titleStyle = getKialiStyle({
  margin: '15px 0 8px 0'
});

// Used in App/Workload/Service Description
// It doesn't hide healthy lines as opposed to the HealthDetails
// Keep it on this class for easy maintenance in future steps, duplication of code is expected.
export const renderTrafficStatus = (serverConfig: ComputedServerConfig, health: Health) => {
  const config = health.getStatusConfig(serverConfig);
  const isValueInConfig = config && health.health.statusConfig ? health.health.statusConfig.value > 0 : false;
  const item = health.getTrafficStatus();
  if (item) {
    const showTraffic = item.children
      ? item.children.filter(sub => {
          const showItem = sub.value && sub.value > 0;
          return sub.status !== HEALTHY && showItem;
        }).length > 0
      : false;
    if (showTraffic) {
      return (
        <div>
          <Title headingLevel="h5" size={TitleSizes.lg} className={titleStyle}>
            Traffic
          </Title>
          {item.text}
          {item.children && (
            <ul style={{ listStyleType: 'none' }}>
              {item.children.map((sub, subIdx) => {
                const showItem = sub.value && sub.value > 0;
                return sub.status !== HEALTHY && showItem ? (
                  <li key={subIdx}>
                    <span style={{ marginRight: '10px' }}>{createIcon(sub.status)}</span>
                    {sub.text}
                  </li>
                ) : (
                  <React.Fragment key={subIdx} />
                );
              })}
              {config && isValueInConfig && (
                <li key={'degraded_failure_config'}>
                  <span style={{ marginRight: '10px' }}>{createIcon(DEGRADED)}</span>:{' '}
                  {config.degraded === 0 ? '>' : '>='}
                  {config.degraded}% {createIcon(FAILURE)}: {config.degraded === 0 ? '>' : '>='}
                  {config.failure}%
                </li>
              )}
            </ul>
          )}
        </div>
      );
    }
  }
  return undefined;
};

export class HealthDetails extends React.PureComponent<Props, {}> {
  renderErrorRate = (serverConfig: ComputedServerConfig, item: HealthItem, idx: number) => {
    const config = this.props.health.getStatusConfig(serverConfig);
    const isValueInConfig =
      config && this.props.health.health.statusConfig ? this.props.health.health.statusConfig.value > 0 : false;

    const showTraffic = item.children
      ? item.children.filter(sub => {
          const showItem = sub.value && sub.value > 0;
          return showItem;
        }).length > 0
      : false;
    return showTraffic ? (
      <div key={idx}>
        {
          <>
            {item.title + (item.text && item.text.length > 0 ? ': ' : '')}{' '}
            {config && <InfoAltIcon color={PFColors.Black600} />}
          </>
        }
        {item.text}
        {item.children && (
          <ul style={{ listStyleType: 'none' }}>
            {item.children.map((sub, subIdx) => {
              const showItem = sub.value && sub.value > 0;
              return showItem ? (
                <li key={subIdx}>
                  <span style={{ marginRight: '10px' }}>{createIcon(sub.status)}</span>
                  {sub.text}
                </li>
              ) : (
                <React.Fragment key={subIdx} />
              );
            })}
            {config && isValueInConfig && (
              <li key={'degraded_failure_config'}>
                <span style={{ marginRight: '10px' }}>{createIcon(DEGRADED)}</span>:{' '}
                {config.degraded === 0 ? '>' : '>='}
                {config.degraded}% {createIcon(FAILURE)}: {config.degraded === 0 ? '>' : '>='}
                {config.failure}%
              </li>
            )}
          </ul>
        )}
      </div>
    ) : (
      <React.Fragment key={idx} />
    );
  };

  renderChildren = (serverConfig: ComputedServerConfig, item: HealthItem, idx: number) => {
    return item.title.startsWith(TRAFFICSTATUS) ? (
      this.renderErrorRate(serverConfig, item, idx)
    ) : (
      <div key={idx}>
        {<>{item.title + (item.text && item.text.length > 0 ? ': ' : '')}</>}
        {item.text}
        {item.children && (
          <ul style={{ listStyleType: 'none' }}>
            {item.children.map((sub, subIdx) => {
              return (
                <li key={subIdx}>
                  <span style={{ marginRight: '10px' }}>{createIcon(sub.status)}</span>
                  {sub.text}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  render() {
    const health = this.props.health;
    return health.health.items.map((item, idx) => {
      return this.renderChildren(this.props.serverConfig, item, idx);
    });
  }
}
