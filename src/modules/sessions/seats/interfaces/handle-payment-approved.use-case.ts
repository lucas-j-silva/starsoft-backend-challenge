import { PaymentApprovedMessage } from '../../../payments/events/messages';

export interface IHandlePaymentApprovedUseCase {
  execute(payload: PaymentApprovedMessage): Promise<void>;
}
