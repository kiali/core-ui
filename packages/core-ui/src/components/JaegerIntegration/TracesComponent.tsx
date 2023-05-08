import * as React from 'react';
import { Card, CardBody, Tab, Tabs, Toolbar, ToolbarGroup, ToolbarItem, Tooltip } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { AxiosError } from 'axios';
import { setTraceId as setURLTraceId } from '../../utils/SearchParamUtils';
// import * as AlertUtils from 'utils/AlertUtils';
// import { RenderComponentScroll } from '../Nav/Page';
// import { KioskElement } from '../Kiosk/KioskElement';
// import { TimeDurationModal } from '../Time/TimeDurationModal';
// import { KialiAppState } from 'store/Store';
import {
  JaegerError,
  JaegerTrace,
  isEqualTimeRange,
  TargetKind,
  TimeInMilliseconds,
  TimeRange,
  getTimeRangeMicros,
  JaegerInfo,
  MetricsStatsQuery,
  getMetricsStats,
  genStatsKey,
  Direction,
  MetricsStatsResult,
  statsQueryToKey,
  MetricsStats,
  MetricsStatsState,
  transformTraceData,
  getJaegerTrace,
  reduceMetricsStats,
  StatsMatrix,
  ComputedServerConfig
} from '@kiali/types';
import { TracesFetcher, FetchOptions } from './TracesFetcher';
// import { timeRangeSelector } from 'store/Selectors';
import { TracesDisplayOptions, QuerySettings, DisplaySettings, percentilesOptions } from './TracesDisplayOptions';
import { getSpanId } from '../../utils/SearchParamUtils';
import { JaegerScatter } from './JaegerScatter';
import { TraceDetails } from './JaegerResults/TraceDetails';
import { SpanDetails } from './JaegerResults/SpanDetails';

// type ReduxProps = {
//   namespaceSelector: boolean;
//   selectedTrace?: JaegerTrace;
//   timeRange: TimeRange;
//   urlJaeger: string;
// };

type ExpiringStats = MetricsStats & { timestamp: number };

type TracesProps = {
  lastRefreshAt: TimeInMilliseconds;
  namespace: string;
  cluster?: string;
  target: string;
  targetKind: TargetKind;
  timeRange: TimeRange;
  jaegerInfo: JaegerInfo;
  serverConfig: ComputedServerConfig;
};

interface TracesState {
  isTimeOptionsOpen: boolean;
  url: string;
  width: number;
  querySettings: QuerySettings;
  displaySettings: DisplaySettings;
  traces: JaegerTrace[];
  jaegerErrors: JaegerError[];
  targetApp?: string;
  activeTab: number;
  toolbarDisabled: boolean;
  metricsStats: MetricsStatsState;
  selectedTrace?: JaegerTrace;
  statsMatrix?: StatsMatrix;
  isStatsMatrixComplete: boolean;
}

const traceDetailsTab = 0;
const spansDetailsTab = 1;

export class TracesComponent extends React.Component<TracesProps, TracesState> {
  private fetcher: TracesFetcher;
  private percentilesPromise: Promise<Map<string, number>>;

  constructor(props: TracesProps) {
    super(props);
    let targetApp: string | undefined = undefined;
    if (this.props.targetKind === 'app') {
      targetApp = this.props.jaegerInfo.namespaceSelector
        ? this.props.target + '.' + this.props.namespace
        : this.props.target;
    }
    this.state = {
      isTimeOptionsOpen: false,
      url: '',
      width: 0,
      querySettings: TracesDisplayOptions.retrieveQuerySettings(),
      displaySettings: TracesDisplayOptions.retrieveDisplaySettings(),
      traces: [],
      jaegerErrors: [],
      targetApp: targetApp,
      activeTab: getSpanId() ? spansDetailsTab : traceDetailsTab,
      toolbarDisabled: false,
      metricsStats: { data: new Map() },
      selectedTrace: undefined,
      isStatsMatrixComplete: false
    };
    this.fetcher = new TracesFetcher(this.onTracesUpdated, errors => {
      // If there was traces displayed already, do not hide them so that the user can still interact with them
      // (consider it's probably a temporary failure)
      // Note that the error message is anyway displayed in the notifications component, so it's not going unnoticed
      if (this.state.traces.length === 0) {
        this.setState({ jaegerErrors: errors, toolbarDisabled: true });
      }
    });
    // This establishes the percentile-based filtering levels
    this.percentilesPromise = this.fetchPercentiles();
  }

  componentDidMount() {
    this.fetchTraces();
  }

  componentDidUpdate(prevProps: TracesProps) {
    // Selected trace (coming from redux) might have been reloaded and needs to be updated within the traces list
    // Check reference of selected trace
    // if (this.props.selectedTrace && prevProps.selectedTrace !== this.props.selectedTrace) {
    //   const traces = this.state.traces;
    //   const trace = this.props.selectedTrace;
    //   const index = traces.findIndex(t => t.traceID === trace.traceID);
    //   if (index >= 0) {
    //     traces[index] = this.props.selectedTrace;
    //     this.setState({ traces: traces });
    //   }
    // }

    const changedTimeRange = !isEqualTimeRange(this.props.timeRange, prevProps.timeRange);
    if (this.props.lastRefreshAt !== prevProps.lastRefreshAt || changedTimeRange) {
      if (changedTimeRange) {
        this.fetcher.resetLastFetchTime();
      }
      this.fetchTraces();
    }
  }

  private setTrace(selectedTrace: JaegerTrace | undefined) {
    if (selectedTrace) {
      const traces = this.state.traces;
      const index = traces.findIndex(t => t.traceID === selectedTrace.traceID);
      if (index >= 0) {
        traces[index] = selectedTrace;
        this.setState({ traces: traces });
      }

      const { matrix, isComplete } = reduceMetricsStats(selectedTrace, this.state.metricsStats.data, false);
      this.setState({
        statsMatrix: matrix,
        isStatsMatrixComplete: isComplete
      });
    }
    this.setState({ selectedTrace: selectedTrace });
  }

  private load = (queries: MetricsStatsQuery[], isCompact: boolean) => {
    const expiry = 2 * 60 * 1000;
    const oldStats = this.state.metricsStats.data as Map<string, ExpiringStats>;
    const now = Date.now();
    // Keep only queries for stats we don't already have, that aren't expired, and are sufficient
    const newStats = new Map(Array.from(oldStats).filter(([_, v]) => now - v.timestamp < expiry));
    const filtered = queries.filter(q => {
      const existingStat = newStats.get(statsQueryToKey(q));
      // perform the query if we don't have the stat, or if we need full stats and only have compact stats
      return !existingStat || (!isCompact && existingStat.isCompact);
    });
    if (filtered.length > 0) {
      return getMetricsStats(filtered)
        .then(res => {
          // Merge result
          Object.entries(res.data.stats).forEach(e =>
            newStats.set(e[0], { ...e[1], timestamp: now, isCompact: isCompact })
          );
          // dispatch(MetricsStatsActions.setStats(newStats));
          this.setState({ metricsStats: { data: newStats } });
          if (res.data.warnings && res.data.warnings.length > 0) {
            // addInfo(res.data.warnings.join('; '), false);
          }
        })
        .catch(err => {
          console.error(err);
          // addError('Could not fetch metrics stats.', err);
        });
    } else {
      return Promise.resolve();
    }
  };

  private setTraceId = (traceId?: string) => {
    setURLTraceId(traceId);
    if (traceId) {
      getJaegerTrace(traceId)
        .then(response => {
          if (response.data.data) {
            const trace = transformTraceData(response.data.data);
            if (trace) {
              this.setTrace(trace);
              // dispatch(JaegerActions.setTrace(trace));
            }
          }
        })
        .catch(error => {
          if ((error as AxiosError).response?.status === 404) {
            setURLTraceId(undefined);
          }
          this.setTrace(undefined);
          // dispatch(JaegerActions.setTrace(undefined));
          // AlertUtils.addMessage({
          //   ...AlertUtils.extractAxiosError('Could not fetch trace', error),
          //   showNotification: false
          // });
        });
    } else {
      this.setTrace(undefined);
      // dispatch(JaegerActions.setTrace(undefined));
    }
  };

  private getTags = () => {
    return this.state.querySettings.errorsOnly ? '{"error":"true"}' : '';
  };

  private fetchTraces = async () => {
    const options: FetchOptions = {
      namespace: this.props.namespace,
      cluster: this.props.cluster,
      target: this.props.target,
      targetKind: this.props.targetKind,
      spanLimit: this.state.querySettings.limit,
      tags: this.getTags()
    };
    // If percentil filter is set fetch only traces above the specified percentile
    // Percentiles (99th, 90th, 75th) are pre-computed from metrics bound to this app/workload/service object.
    if (this.state.querySettings.percentile && this.state.querySettings.percentile !== 'all') {
      try {
        const percentiles = await this.percentilesPromise;
        options.minDuration = percentiles.get(this.state.querySettings.percentile);
        if (!options.minDuration) {
          // AlertUtils.addWarning('Cannot perform query above the requested percentile (value unknown).');
        }
      } catch (err) {
        // AlertUtils.addError(`Could not fetch percentiles: ${err}`);
      }
    }
    this.fetcher.fetch(options, this.state.traces);
  };

  private fetchPercentiles = (): Promise<Map<string, number>> => {
    // We'll fetch percentiles on a large enough interval (unrelated to the selected interval)
    // in order to have stable values and avoid constantly fetching again
    const query: MetricsStatsQuery = {
      queryTime: Math.floor(Date.now() / 1000),
      target: {
        namespace: this.props.namespace,
        name: this.props.target,
        kind: this.props.targetKind
      },
      interval: '1h',
      direction: 'inbound',
      avg: false,
      quantiles: percentilesOptions.map(p => p.id).filter(id => id !== 'all')
    };
    const queries: MetricsStatsQuery[] =
      this.props.targetKind === 'service' ? [query] : [query, { ...query, direction: 'outbound' }];
    return getMetricsStats(queries).then(r => this.percentilesFetched(query, r.data));
  };

  private percentilesFetched = (q: MetricsStatsQuery, r: MetricsStatsResult): Map<string, number> => {
    if (r.warnings) {
      // AlertUtils.addWarning(r.warnings.join(', '));
    }
    const [mapInbound, mapOutbound] = (['inbound', 'outbound'] as Direction[]).map(dir => {
      const map = new Map<string, number>();
      const key = genStatsKey(q.target, undefined, dir, q.interval);
      if (key) {
        const statsForKey = r.stats[key];
        if (statsForKey) {
          statsForKey.responseTimes.forEach(rt => {
            if (q.quantiles.includes(rt.name)) {
              map.set(rt.name, rt.value);
            }
          });
        }
      }
      return map;
    });
    // Merge the two maps; if a value exists in both of them, take the mean
    const minDurations = new Map<string, number>();
    mapInbound.forEach((v1, k) => {
      const v2 = mapOutbound.get(k);
      if (v2) {
        minDurations.set(k, (v1 + v2) / 2);
        mapOutbound.delete(k);
      } else {
        minDurations.set(k, v1);
      }
    });
    mapOutbound.forEach((v, k) => minDurations.set(k, v));
    return minDurations;
  };

  private onTracesUpdated = (traces: JaegerTrace[], jaegerServiceName: string) => {
    const newState: Partial<TracesState> = { traces: traces, jaegerErrors: undefined, toolbarDisabled: false };
    if (this.state.targetApp === undefined && jaegerServiceName) {
      newState.targetApp = jaegerServiceName;
    }
    this.setState(newState as TracesState);
  };

  private getJaegerUrl = () => {
    if (this.props.jaegerInfo.url === '' || !this.state.targetApp) {
      return undefined;
    }

    const range = getTimeRangeMicros();
    let url = `${this.props.jaegerInfo.url}/search?service=${this.state.targetApp}&start=${range.from}&limit=${this.state.querySettings.limit}`;
    if (range.to) {
      url += `&end=${range.to}`;
    }
    const tags = this.getTags();
    if (tags) {
      url += `&tags=${tags}`;
    }
    return url;
  };

  private onQuerySettingsChanged = (settings: QuerySettings) => {
    this.fetcher.resetLastFetchTime();
    this.setState({ querySettings: settings }, this.fetchTraces);
  };

  private onDisplaySettingsChanged = (settings: DisplaySettings) => {
    this.setState({ displaySettings: settings });
  };

  // private toggleTimeOptionsVisibility = () => {
  //   this.setState(prevState => ({ isTimeOptionsOpen: !prevState.isTimeOptionsOpen }));
  // };

  render() {
    const jaegerURL = this.getJaegerUrl();
    return (
      <>
        {/* <RenderComponentScroll> */}
        <Card>
          <CardBody>
            <Toolbar style={{ padding: 0 }}>
              <ToolbarGroup>
                <ToolbarItem>
                  <TracesDisplayOptions
                    onDisplaySettingsChanged={this.onDisplaySettingsChanged}
                    onQuerySettingsChanged={this.onQuerySettingsChanged}
                    percentilesPromise={this.percentilesPromise}
                    disabled={this.state.toolbarDisabled}
                  />
                </ToolbarItem>
                <ToolbarItem style={{ marginLeft: 'auto' }}>
                  {/*Blank item used as a separator do shift the following ToolbarItems to the right*/}
                </ToolbarItem>
                {jaegerURL && (
                  <ToolbarItem>
                    <Tooltip content={<>Open Chart in Jaeger UI</>}>
                      <a href={jaegerURL} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px' }}>
                        View in Tracing <ExternalLinkAltIcon />
                      </a>
                    </Tooltip>
                  </ToolbarItem>
                )}
                {/* <KioskElement>
                  <ToolbarItem>
                    <TimeDurationIndicatorContainer onClick={this.toggleTimeOptionsVisibility} />
                  </ToolbarItem>
                </KioskElement> */}
              </ToolbarGroup>
            </Toolbar>
            <JaegerScatter
              showSpansAverage={this.state.displaySettings.showSpansAverage}
              traces={this.state.traces}
              errorFetchTraces={this.state.jaegerErrors}
              errorTraces={true}
              duration={1000}
              loadMetricsStats={this.load}
              setTraceId={this.setTraceId}
            />
          </CardBody>
        </Card>
        {this.state.selectedTrace && (
          <div
            style={{
              marginTop: 25
            }}
          >
            <Tabs
              id="trace-details"
              data-test="trace-details-tabs"
              activeKey={this.state.activeTab}
              onSelect={(_, idx: any) => this.setState({ activeTab: idx })}
            >
              <Tab eventKey={traceDetailsTab} title="Trace Details">
                <TraceDetails
                  namespace={this.props.namespace}
                  target={this.props.target}
                  targetKind={this.props.targetKind}
                  jaegerURL={this.props.jaegerInfo.url}
                  otherTraces={this.state.traces}
                  isStatsMatrixComplete={this.state.isStatsMatrixComplete}
                  statsMatrix={this.state.statsMatrix}
                  loadMetricsStats={this.load}
                  trace={this.state.selectedTrace}
                  setTraceId={this.setTraceId}
                />
              </Tab>
              <Tab eventKey={spansDetailsTab} title="Span Details">
                <SpanDetails
                  namespace={this.props.namespace}
                  target={this.props.target}
                  externalURL={this.props.jaegerInfo.url}
                  items={this.state.selectedTrace.spans}
                  metricsStats={this.state.metricsStats.data}
                  loadMetricsStats={this.load}
                  serverConfig={this.props.serverConfig}
                />
              </Tab>
            </Tabs>
          </div>
        )}
        {/* </RenderComponentScroll>
        <TimeDurationModal
          customDuration={true}
          isOpen={this.state.isTimeOptionsOpen}
          onConfirm={this.toggleTimeOptionsVisibility}
          onCancel={this.toggleTimeOptionsVisibility}
        /> */}
      </>
    );
  }
}

// const mapStateToProps = (state: KialiAppState) => {
//   return {
//     timeRange: timeRangeSelector(state),
//     urlJaeger: state.jaegerState.info ? state.jaegerState.info.url : '',
//     namespaceSelector: state.jaegerState.info ? state.jaegerState.info.namespaceSelector : true,
//     selectedTrace: state.jaegerState.selectedTrace
//   };
// };

// export const TracesContainer = connect(mapStateToProps)(TracesComponent);

// export default TracesContainer;
