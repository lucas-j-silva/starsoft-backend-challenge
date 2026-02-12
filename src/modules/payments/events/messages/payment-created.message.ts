export class PaymentCreatedMessage {
  id: string;
  userId: string;
  amountInCents: number;
  expiresAt: Date | null;
  externalId: string | null;

  constructor(data: PaymentCreatedMessage) {
    Object.assign(this, data);
  }
}
