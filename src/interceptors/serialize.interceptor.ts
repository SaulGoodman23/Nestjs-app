import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

// Interface -> any class supported with this interface
interface ClassConstructor {
  new (...args: any[]): {};
}

// Custom Decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// Custom Interceptor
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  // intercept method can return Observable type with any property on it.
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled by the request handler
    // console.log("I'm running before request handler", context);

    return handler.handle().pipe(
      map((data: any) => {
        // data-> data that we sent back in response
        // Run something before response sent out
        // console.log("I'm running before response sent out ", data);
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
