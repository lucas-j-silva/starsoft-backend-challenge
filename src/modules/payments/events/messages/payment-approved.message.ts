export class PaymentApprovedMessage {
  id: string;
  userId: string;
  amountInCents: number;
  expiresAt: Date | null;
  approvedAt: Date;
  externalId: string | null;

  constructor(data: PaymentApprovedMessage) {
    Object.assign(this, data);
  }
}
