import * as React from 'react';
import { Card, CardBody } from '@patternfly/react-core';

import { RichSpanData, ActiveFiltersInfo, MetricsStats, ComputedServerConfig, MetricsStatsQuery } from '@kiali/types';
import { SpanTable } from './SpanTable';
import { FilterSelected, StatefulFilters } from '../../Filters/StatefulFilters';
import { spanFilters } from './Filters';
import { runFilters } from '../../FilterList/FilterHelper';
import { TraceLabels } from './TraceLabels';

interface Props {
  items: RichSpanData[];
  namespace: string;
  target: string;
  externalURL?: string;
  loadMetricsStats: (queries: MetricsStatsQuery[], isCompact: boolean) => void;
  metricsStats: Map<string, MetricsStats>;
  serverConfig: ComputedServerConfig;
}

interface State {
  activeFilters: ActiveFiltersInfo;
}

export class SpanDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const filters = spanFilters(props.items);
    this.state = {
      activeFilters: FilterSelected.init(filters)
    };
  }

  render() {
    const filters = spanFilters(this.props.items);
    const filteredItems = runFilters(this.props.items, filters, this.state.activeFilters);
    return (
      <Card isCompact style={{ border: '1px solid #e6e6e6' }}>
        <CardBody>
          <StatefulFilters
            initialFilters={filters}
            onFilterChange={active => this.setState({ activeFilters: active })}
            serverConfig={this.props.serverConfig}
          >
            <TraceLabels
              spans={this.props.items}
              filteredSpans={this.state.activeFilters.filters.length > 0 ? filteredItems : undefined}
              oneline={true}
            />
          </StatefulFilters>
          <SpanTable
            items={filteredItems}
            namespace={this.props.namespace}
            externalURL={this.props.externalURL}
            loadMetricsStats={this.props.loadMetricsStats}
            metricsStats={this.props.metricsStats}
          />
        </CardBody>
      </Card>
    );
  }
}
