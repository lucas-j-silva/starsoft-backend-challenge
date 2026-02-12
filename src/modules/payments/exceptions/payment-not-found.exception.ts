import { Logger, NotFoundException } from '@nestjs/common';

export class PaymentNotFoundException extends NotFoundException {
  private readonly logger = new Logger(PaymentNotFoundException.name);

  constructor(id?: string) {
    const message = id ? 'payments.NOT_FOUND_WITH_ID' : 'payments.NOT_FOUND';

    super(message);

    this.logger.warn(message);
  }
}
