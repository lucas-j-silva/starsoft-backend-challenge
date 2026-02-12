import { BadRequestException, Logger } from '@nestjs/common';

export class UnableToCreatePaymentException extends BadRequestException {
  private readonly logger = new Logger(UnableToCreatePaymentException.name);

  constructor() {
    const message = 'payments.UNABLE_TO_CREATE_PAYMENT';

    super(message);

    this.logger.warn(message);
  }
}
