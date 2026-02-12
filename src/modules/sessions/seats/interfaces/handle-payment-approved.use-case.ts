import { PaymentApprovedMessage } from 'src/modules/payments/events/messages';

export interface IHandlePaymentApprovedUseCase {
  execute(payload: PaymentApprovedMessage): Promise<void>;
}
