import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Response } from 'express';
import { CustomException } from './custom.exception';

@Catch(CustomException)
export class HttpExceptionFilter implements ExceptionFilter<CustomException> {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionMessage = exception.message;

    if (exception instanceof CustomException) {
      const exceptionArgs = exception.getArgs();
      const statusCode = exception.getStatus();

      const i18nMessage = await this.i18n.t(exceptionMessage, {
        defaultValue: exceptionMessage,
        args: exceptionArgs,
      });

      response.status(statusCode).send({
        message: i18nMessage,
        statusCode: statusCode,
        error: exception.name,
      });
    }
  }
}
