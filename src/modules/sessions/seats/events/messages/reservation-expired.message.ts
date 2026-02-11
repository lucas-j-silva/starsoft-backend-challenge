/**
 * @fileoverview Message class for reservation expired events.
 *
 * @description
 * This file contains the ReservationExpiredMessage class which represents
 * the payload structure for seat reservation expiration events sent via Kafka.
 *
 * @module reservation-expired.message
 */

/**
 * Message class representing a seat reservation expiration event.
 *
 * @description
 * This class defines the structure of the message payload sent when
 * a seat reservation has expired. It is used for event-driven
 * communication via Kafka messaging.
 *
 * @class ReservationExpiredMessage
 *
 * @example
 * const message = new ReservationExpiredMessage({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   createdAt: new Date(),
 *   userId: '550e8400-e29b-41d4-a716-446655440001',
 *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440002',
 *   expiresAt: new Date(Date.now() + 15 * 60 * 1000),
 * });
 */
export class ReservationExpiredMessage {
  /**
   * The unique identifier of the reservation.
   *
   * @type {string}
   * @memberof ReservationExpiredMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440000'
   */
  id: string;

  /**
   * The timestamp when the reservation was created.
   *
   * @type {Date}
   * @memberof ReservationExpiredMessage
   *
   * @example
   * new Date('2024-01-15T19:30:00Z')
   */
  createdAt: Date;

  /**
   * The unique identifier of the user who made the reservation.
   *
   * @type {string}
   * @memberof ReservationExpiredMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440001'
   */
  userId: string;

  /**
   * The unique identifier of the session seat that was reserved.
   *
   * @type {string}
   * @memberof ReservationExpiredMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440002'
   */
  sessionSeatId: string;

  /**
   * The timestamp when the reservation expired.
   *
   * @type {Date}
   * @memberof ReservationExpiredMessage
   *
   * @example
   * new Date('2024-01-15T19:45:00Z')
   */
  expiresAt: Date;

  /**
   * Creates an instance of ReservationExpiredMessage.
   *
   * @param {ReservationExpiredMessage} data - Data to initialize the message.
   */
  constructor(data: ReservationExpiredMessage) {
    Object.assign(this, data);
  }
}
