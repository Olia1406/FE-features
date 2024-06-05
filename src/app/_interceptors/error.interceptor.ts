import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { MessageContentComponent } from '../components/message-content/message-content.component';
import { PortalService } from '../modules/message-portal/portal.service';
import { MessageBgColors } from '@shared/enums';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const portaServ = inject(PortalService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
        portaServ.open({
          message: err?.error?.message || 'Requers error occured',
          bgColor: MessageBgColors.Red,
          component: MessageContentComponent,
        });
      return throwError(() => err);
    }),
  );
};
