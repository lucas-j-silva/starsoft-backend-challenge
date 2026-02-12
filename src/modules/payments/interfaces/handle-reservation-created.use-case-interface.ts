import { ReservationCreatedMessage } from 'src/modules/sessions/seats/events/messages';

export interface IHandleReservationCreatedUseCase {
  execute(payload: ReservationCreatedMessage): Promise<void>;
}
