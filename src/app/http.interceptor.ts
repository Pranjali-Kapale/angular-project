import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TelemetryService } from './telemetry.service';

@Injectable()
export class TelemetryInterceptor implements HttpInterceptor {
  constructor(private telemetry: TelemetryService) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const startTime = performance.now();
    const traceId = this.telemetry.getTraceId();
    // 🔹 ADD TELEMETRY DATA TO HEADERS
    const tracedRequest = req.clone({
      setHeaders: {
        'X-Trace-Id': traceId,
        'X-Client-Time': new Date().toISOString(),
        'X-Client-App': 'Angular-Web',
      }
    });
    return next.handle(tracedRequest).pipe(
      tap({
        next: () => {
          const duration = Math.round(performance.now() - startTime);
          this.telemetry.trace('ApiSuccess', {
            url: req.url,
            method: req.method,
            durationMs: duration,
            tracerId: traceId,
          });
        },
        error: (error: HttpErrorResponse) => {
          const duration = Math.round(performance.now() - startTime);

          this.telemetry.trace('ApiFailure', {
            url: req.url,
            method: req.method,
            status: error.status,
            durationMs: duration,
            tracerId: traceId,
          });

          this.telemetry.traceError(error, 'HTTP_API_ERROR');
        }
      })
    );
  }
}
