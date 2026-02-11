/**
 * @fileoverview Message class for session seat released events.
 *
 * @description
 * This file contains the SessionSeatReleasedMessage class which represents
 * the payload structure for session seat release events sent via Kafka.
 *
 * @module session-seat-released.message
 */

/**
 * Message class representing a session seat release event.
 *
 * @description
 * This class defines the structure of the message payload sent when
 * a session seat has been released. It is used for event-driven
 * communication via Kafka messaging.
 *
 * @class SessionSeatReleasedMessage
 *
 * @example
 * const message = new SessionSeatReleasedMessage({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   releasedAt: new Date(),
 * });
 */
export class SessionSeatReleasedMessage {
  /**
   * The unique identifier of the session seat that was released.
   *
   * @type {string}
   * @memberof SessionSeatReleasedMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440000'
   */
  id: string;

  /**
   * The timestamp when the session seat was released.
   *
   * @type {Date}
   * @memberof SessionSeatReleasedMessage
   *
   * @example
   * new Date('2024-01-15T19:30:00Z')
   */
  releasedAt: Date;

  /**
   * Creates an instance of SessionSeatReleasedMessage.
   *
   * @param {SessionSeatReleasedMessage} data - Data to initialize the message.
   */
  constructor(data: SessionSeatReleasedMessage) {
    Object.assign(this, data);
  }
}
