import { BadRequestException, Logger } from '@nestjs/common';

export class UnableToApprovePaymentException extends BadRequestException {
  private readonly logger = new Logger(UnableToApprovePaymentException.name);

  constructor(customMessage?: string) {
    const message = customMessage ?? 'Unable to approve payment';

    super(message);

    this.logger.warn(message);
  }
}
