/**
 * Message class representing a session seat reservation conflict event.
 *
 * @description
 * This message is published when a payment is approved but the associated
 * seat was already sold, resulting in a conflict that requires the payment
 * to be refunded. It contains the necessary information to identify the
 * reservation, seat, and user involved in the conflict.
 *
 * @class SessionSeatReservationConflictMessage
 *
 * @example
 * const conflictMessage = new SessionSeatReservationConflictMessage({
 *   reservationId: '550e8400-e29b-41d4-a716-446655440000',
 *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440001',
 *   userId: '550e8400-e29b-41d4-a716-446655440002',
 * });
 */
export class SessionSeatReservationConflictMessage {
  /**
   * The unique identifier of the reservation that encountered the conflict.
   *
   * @type {string}
   * @memberof SessionSeatReservationConflictMessage
   */
  reservationId: string;

  /**
   * The unique identifier of the session seat that was already sold.
   *
   * @type {string}
   * @memberof SessionSeatReservationConflictMessage
   */
  sessionSeatId: string;

  /**
   * The unique identifier of the user who made the conflicting reservation.
   *
   * @type {string}
   * @memberof SessionSeatReservationConflictMessage
   */
  userId: string;

  /**
   * Creates an instance of SessionSeatReservationConflictMessage.
   *
   * @param {SessionSeatReservationConflictMessage} data - The data to initialize the message with.
   */
  constructor(data: SessionSeatReservationConflictMessage) {
    Object.assign(this, data);
  }
}
