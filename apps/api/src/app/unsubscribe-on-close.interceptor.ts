import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { bindCallback, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class UnsubscribeOnCloseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [request] = context.getArgs();

    const close$ = bindCallback(request.socket.on).call(
      request.socket,
      'close'
    );

    return next.handle().pipe(takeUntil(close$));
  }
}
