import * as React from 'react';
import { ICell, ISortBy, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { ActiveFiltersInfo, FilterType, ComputedServerConfig } from '@kiali/types';
import { StatefulFilters } from '../../Filters/StatefulFilters';
import ToolbarDropdown from '../../ToolbarDropdown/ToolbarDropdown';
import { PFBadge, PFBadges } from '../../Pf/PfBadges';
import { TooltipPosition } from '@patternfly/react-core';
import { style } from 'typestyle';

export interface SummaryTable {
  head: () => ICell[];
  rows: () => (string | number | JSX.Element)[][];
  resource: () => string;
  sortBy: () => ISortBy;
  setSorting: (columnIndex: number, direction: 'asc' | 'desc') => void;
  availableFilters: () => FilterType[];
  tooltip: () => React.ReactNode;
}

const iconStyle = style({
  display: 'inline-block'
});

export interface SummaryTableProps<T> {
  writer: T;
  sortBy: ISortBy;
  onSort: (resource: string, columnIndex: number, sortByDirection: SortByDirection) => void;
  pod: string;
  pods: string[];
  setPod: (pod: string) => void;
  serverConfig: ComputedServerConfig;
}

export function SummaryTableRenderer<T extends SummaryTable>() {
  type SummaryTableState = {
    activeFilters: ActiveFiltersInfo;
  };

  return class SummaryTable extends React.Component<SummaryTableProps<T>, SummaryTableState> {
    onSort = (_: React.MouseEvent, columnIndex: number, sortByDirection: SortByDirection) => {
      this.props.writer.setSorting(columnIndex, sortByDirection);
      this.props.onSort(this.props.writer.resource(), columnIndex, sortByDirection);
    };

    onFilterApplied = (activeFilter: ActiveFiltersInfo) => {
      this.setState({
        activeFilters: activeFilter
      });
    };

    render() {
      return (
        <>
          <StatefulFilters
            initialFilters={this.props.writer.availableFilters()}
            onFilterChange={this.onFilterApplied}
            childrenFirst={true}
            serverConfig={this.props.serverConfig}
          >
            <>
              <div key="service-icon" className={iconStyle}>
                <PFBadge badge={PFBadges.Pod} position={TooltipPosition.top} />
              </div>
              <ToolbarDropdown
                id="envoy_pods_list"
                tooltip="Display envoy config for the selected pod"
                handleSelect={key => this.props.setPod(key)}
                value={this.props.pod}
                label={this.props.pod}
                options={this.props.pods.sort()}
              />
              <div className={style({ position: 'fixed', right: '60px' })}>{this.props.writer.tooltip()}</div>
            </>
          </StatefulFilters>
          <Table
            aria-label="Sortable Table"
            cells={this.props.writer.head()}
            rows={this.props.writer.rows()}
            sortBy={this.props.writer.sortBy()}
            onSort={this.onSort}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </>
      );
    }
  };
}
