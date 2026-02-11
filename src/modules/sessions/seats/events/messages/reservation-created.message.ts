/**
 * @fileoverview Message class for reservation created events.
 *
 * @description
 * This file contains the ReservationCreatedMessage class which represents
 * the payload structure for seat reservation creation events sent via Kafka.
 *
 * @module reservation-created.message
 */

/**
 * Message class representing a seat reservation creation event.
 *
 * @description
 * This class defines the structure of the message payload sent when
 * a new seat reservation is created. It is used for event-driven
 * communication via Kafka messaging.
 *
 * @class ReservationCreatedMessage
 *
 * @example
 * const message = new ReservationCreatedMessage({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   createdAt: new Date(),
 *   userId: '550e8400-e29b-41d4-a716-446655440001',
 *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440002',
 *   expiresAt: new Date(Date.now() + 15 * 60 * 1000),
 * });
 */
export class ReservationCreatedMessage {
  /**
   * The unique identifier of the reservation.
   *
   * @type {string}
   * @memberof ReservationCreatedMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440000'
   */
  id: string;

  /**
   * The timestamp when the reservation was created.
   *
   * @type {Date}
   * @memberof ReservationCreatedMessage
   *
   * @example
   * new Date('2024-01-15T19:30:00Z')
   */
  createdAt: Date;

  /**
   * The unique identifier of the user who made the reservation.
   *
   * @type {string}
   * @memberof ReservationCreatedMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440001'
   */
  userId: string;

  /**
   * The unique identifier of the session seat being reserved.
   *
   * @type {string}
   * @memberof ReservationCreatedMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440002'
   */
  sessionSeatId: string;

  /**
   * The timestamp when the reservation expires.
   *
   * @type {Date}
   * @memberof ReservationCreatedMessage
   *
   * @example
   * new Date('2024-01-15T19:45:00Z')
   */
  expiresAt: Date;

  /**
   * Creates an instance of ReservationCreatedMessage.
   *
   * @param {ReservationCreatedMessage} data - Data to initialize the message.
   */
  constructor(data: ReservationCreatedMessage) {
    Object.assign(this, data);
  }
}
