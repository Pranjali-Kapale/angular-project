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
  constructor(private telemetry: TelemetryService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const startTime = performance.now();
    return next.handle(req).pipe(
      tap({
        next: () => {
          const duration = Math.round(performance.now() - startTime);
          this.telemetry.trace('ApiSuccess', {
            url: req.url,
            method: req.method,
            durationMs: duration
          });
        },
        error: (error: HttpErrorResponse) => {
          const duration = Math.round(performance.now() - startTime);

          this.telemetry.trace('ApiFailure', {
            url: req.url,
            method: req.method,
            status: error.status,
            durationMs: duration
          });

          this.telemetry.traceError(error, 'HTTP_API_ERROR');
        }
      })
    );
  }
}
