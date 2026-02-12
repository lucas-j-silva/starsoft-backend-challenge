import { BadRequestException, Logger } from '@nestjs/common';

export class UnableToApprovePaymentException extends BadRequestException {
  private readonly logger = new Logger(UnableToApprovePaymentException.name);

  constructor(customMessage?: string) {
    const message = customMessage ?? 'payments.UNABLE_TO_APPROVE_PAYMENT';

    super(message);

    this.logger.warn(message);
  }
}
