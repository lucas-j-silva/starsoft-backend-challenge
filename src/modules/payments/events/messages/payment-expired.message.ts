export class PaymentExpiredMessage {
  id: string;
  userId: string;
  amountInCents: number;
  expiresAt: Date | null;
  externalId: string | null;

  expiredAt: Date;

  constructor(data: PaymentExpiredMessage) {
    Object.assign(this, data);
  }
}
