import { bootstrapApplication } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { TelemetryInterceptor } from './app/http.interceptor';

bootstrapApplication(App, {
  ...appConfig,

  // method 1 to register interceptor
  // providers: [
  //   ...(appConfig.providers || []),

  //   // ✅ Register HTTP Interceptor
  //   provideHttpClient(
  //    withInterceptors([
  //       (req, next) => {
  //         console.log(' Interceptor HIT:', req.url);
  //         return next(req);
  //       }
  //     ])
  //   ),
  //   TelemetryInterceptor
  // ]

// method 2 to register interceptor
   providers: [
    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: TelemetryInterceptor,
      multi: true
    }
  ]
  
}).catch(err => console.error(err));
