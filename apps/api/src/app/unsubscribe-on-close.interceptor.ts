import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { fromEvent, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class UnsubscribeOnCloseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    const close$ = fromEvent(request.socket, 'close');

    return next.handle().pipe(takeUntil(close$));
  }
}
