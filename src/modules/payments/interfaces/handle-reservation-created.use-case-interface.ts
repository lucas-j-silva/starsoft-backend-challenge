import { ReservationCreatedMessage } from '../../sessions/seats/events/messages';

export interface IHandleReservationCreatedUseCase {
  execute(payload: ReservationCreatedMessage): Promise<void>;
}
