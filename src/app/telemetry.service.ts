import { Injectable } from '@angular/core';

export interface TelemetryEvent {
  eventName: string;
  timestamp: number;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {

  /**
   * Trace any custom or system event
   * Example: ApiSuccess, LoginClick, PageLoad
   */
  trace(eventName: string, data?: any): void {
    const payload: TelemetryEvent = {
      eventName,
      timestamp: Date.now(),
      data
    };

    this.sendToLogger(payload);
  }

  /**
   * Trace application errors
   * Example: HTTP errors, runtime exceptions
   */
  traceError(error: any, context?: string): void {
    const payload = {
      eventName: 'Error',
      timestamp: Date.now(),
      context,
      message: error?.message || 'Unknown error',
      stack: error?.stack || null,
      status: error?.status || null
    };

    this.sendToLogger(payload);
  }

  /**
   * Trace performance metrics
   * Example: page load time, api response time
   */
  tracePerformance(metric: string, durationMs: number, metadata?: any): void {
    const payload = {
      eventName: 'PerformanceMetric',
      timestamp: Date.now(),
      metric,
      durationMs,
      metadata
    };

    this.sendToLogger(payload);
  }

  /**
   * Central place to send telemetry data
   * Replace console with real monitoring tools
   */
  private sendToLogger(payload: any): void {

    // 🚀 DEV MODE
    if (!this.isProduction()) {
      console.group('📡 Telemetry Event');
      console.log(payload);
      console.groupEnd();
      return;
    }

    // 🚀 PROD MODE
    // Example integrations:
    // Application Insights
    // Sentry
    // Datadog
    // New Relic

    // Example pseudo-code:
    // appInsights.trackEvent(payload);
    // sentry.captureMessage(payload);

  }

  /**
   * Detect environment
   */
  private isProduction(): boolean {
    return false; // replace with environment.production
  }
}
