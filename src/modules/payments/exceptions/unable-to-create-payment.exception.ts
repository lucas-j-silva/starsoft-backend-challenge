import { BadRequestException, Logger } from '@nestjs/common';

export class UnableToCreatePaymentException extends BadRequestException {
  private readonly logger = new Logger(UnableToCreatePaymentException.name);

  constructor() {
    const message = 'Unable to create payment';

    super(message);

    this.logger.warn(message);
  }
}
