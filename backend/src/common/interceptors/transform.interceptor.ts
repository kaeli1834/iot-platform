import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ClassType<T> = new (...args: any[]) => T;

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  constructor(private readonly classType: ClassType<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        if (data === null || data === undefined) return data;
        // plainToInstance handles both single objects and arrays
        const transformedData = plainToInstance(this.classType, data, {
          excludeExtraneousValues: true,
        });
        return transformedData;
      }),
    );
  }
}
