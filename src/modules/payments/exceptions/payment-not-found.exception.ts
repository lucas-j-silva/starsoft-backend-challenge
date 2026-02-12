import { Logger, NotFoundException } from '@nestjs/common';

export class PaymentNotFoundException extends NotFoundException {
  private readonly logger = new Logger(PaymentNotFoundException.name);

  constructor(id?: string) {
    const message = id
      ? `Payment with id or external id ${id} not found`
      : 'Payment not found';

    super(message);

    this.logger.warn(message);
  }
}
