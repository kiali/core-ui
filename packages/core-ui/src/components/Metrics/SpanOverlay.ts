import {
  TimeRange,
  durationToBounds,
  guardTimeRange,
  TracingSpan,
  TracingQuery,
  MetricsObjectTypes,
  LineInfo,
  Overlay,
  getAppSpans,
  getServiceSpans,
  getWorkloadSpans,
  OverlayInfo,
  PFColors,
  toOverlay
} from '@kiali/types';
// import * as API from 'services/Api';
// import * as AlertUtils from 'utils/AlertUtils';
import { defaultMetricsDuration } from './Helper';

export type JaegerLineInfo = LineInfo & { traceId?: string; spanId?: string };

type FetchOptions = {
  namespace: string;
  cluster?: string;
  target: string;
  targetKind: MetricsObjectTypes;
  range: TimeRange;
};

export class SpanOverlay {
  private spans: TracingSpan[] = [];
  private lastFetchError = false;

  constructor(public onChange: (overlay?: Overlay<JaegerLineInfo>) => void) {}

  reset() {
    this.spans = [];
  }

  setSpans(spans: TracingSpan[]) {
    this.spans = spans;
  }

  fetch(opts: FetchOptions) {
    const boundsMillis = guardTimeRange(opts.range, durationToBounds, b => b);
    const defaultFrom = new Date().getTime() - defaultMetricsDuration * 1000;
    const q: TracingQuery = {
      startMicros: boundsMillis.from ? boundsMillis.from * 1000 : defaultFrom * 1000,
      endMicros: boundsMillis.to ? boundsMillis.to * 1000 : undefined
    };
    // Remove any out-of-bound spans
    this.spans = this.spans.filter(
      s => s.startTime >= q.startMicros && (q.endMicros === undefined || s.startTime <= q.endMicros)
    );
    // Start fetching from last fetched data when available
    if (this.spans.length > 0) {
      q.startMicros = 1 + Math.max(...this.spans.map(s => s.startTime));
    }
    const apiCall =
      opts.targetKind === MetricsObjectTypes.APP
        ? getAppSpans
        : opts.targetKind === MetricsObjectTypes.SERVICE
        ? getServiceSpans
        : getWorkloadSpans;
    apiCall(opts.namespace, opts.target, q)
      .then(res => {
        this.lastFetchError = false;
        // Incremental refresh: we keep existing spans
        this.spans = this.spans.concat(res.data);
        this.onChange(this.buildOverlay());
      })
      .catch(err => {
        if (!this.lastFetchError) {
          // AlertUtils.addError('Could not fetch spans.', err);
          console.error(err);
          this.lastFetchError = true;
        }
      });
  }

  private buildOverlay(): Overlay<JaegerLineInfo> | undefined {
    if (this.spans.length > 0) {
      const info: OverlayInfo<JaegerLineInfo> = {
        lineInfo: {
          name: 'Span duration',
          unit: 'seconds',
          color: PFColors.Cyan300,
          symbol: 'circle',
          size: 10
        },
        dataStyle: {
          fill: ({ datum }) => (datum.error ? PFColors.Danger : PFColors.Cyan300),
          fillOpacity: 0.6,
          cursor: 'pointer'
        },
        buckets: this.spans.length > 1000 ? 15 : 0
      };
      const dps = this.spans.map(span => {
        const hasError = span.tags.some(tag => tag.key === 'error' && tag.value);
        const methodTags = span.tags.filter(tag => tag.key === 'http.method');
        const method = methodTags.length > 0 ? methodTags[0].value : undefined;
        return {
          name: `${method && `[${method}] `}${span.operationName}`,
          x: new Date(span.startTime / 1000),
          y: Number(span.duration / 1000000),
          error: hasError,
          color: hasError ? PFColors.Danger : PFColors.Cyan300,
          size: 4,
          traceId: span.traceID,
          spanId: span.spanID
        };
      });
      return toOverlay(info, dps);
    }
    return undefined;
  }
}