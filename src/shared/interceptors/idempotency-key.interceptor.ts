/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheClientService } from '../cache/cache-client.service';

@Injectable()
export class IdempotencyKeyInterceptor implements NestInterceptor {
  constructor(private readonly cacheClientService: CacheClientService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const idempotencyKey = request.headers['x-idempotency-key'] as
      | string
      | undefined;

    if (!idempotencyKey) return next.handle();

    if (!this.isValidUUID(idempotencyKey)) {
      throw new BadRequestException(
        "Header 'x-idempotency-key' must be a UUID.",
      );
    }

    const idempotencyValue = await this.cacheClientService
      .getInstance()
      .get(`idempotency:${idempotencyKey}`);

    if (idempotencyValue) {
      return of(JSON.parse(idempotencyValue));
    }

    // await this.idempotencyRepository.preSave(idempotencyKey);

    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheClientService
          .getInstance()
          .set(`idempotency:${idempotencyKey}`, JSON.stringify(data), {
            expiration: { type: 'EX', value: 30 },
          });

        return data;
      }),
    );
  }

  private isValidUUID(uuid: string) {
    const uuidRegex =
      /(?:^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$)|(?:^0{8}-0{4}-0{4}-0{4}-0{12}$)/u;
    return uuidRegex.test(uuid);
  }
}
