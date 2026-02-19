/**
 * @fileoverview Enum for session seats event messages.
 *
 * @description
 * This file contains the SessionSeatsMessages enum which defines
 * the message identifiers used for session seats related events.
 *
 * @module session-seats-messages.enum
 */

/**
 * Enum representing message topics for session seats events.
 *
 * @description
 * Defines the event message keys used throughout the session seats module
 * for event-driven communication and message handling.
 *
 * @enum {string}
 *
 * @example
 * // Using the enum for event emission
 * eventEmitter.emit(SessionSeatsMessages.RESERVATIONS_CREATED, payload);
 */
export enum SessionSeatsMessagesTopics {
  /**
   * Message topic for when seat reservations have expired.
   *
   * @type {string}
   * @memberof SessionSeatsMessagesTopics
   */
  RESERVATIONS_EXPIRED = 'session-seats.reservations.expired',

  /**
   * Message topic for when new seat reservations have been created.
   *
   * @type {string}
   * @memberof SessionSeatsMessagesTopics
   */
  RESERVATIONS_CREATED = 'session-seats.reservations.created',

  /**
   * Message topic for when a session seat has been released.
   *
   * @type {string}
   * @memberof SessionSeatsMessagesTopics
   */
  SESSION_SEAT_RELEASED = 'session-seats.seats.released',

  /**
   * Message topic for when a payment-approved event targets a seat that
   * was already sold, triggering a reservation conflict and refund.
   *
   * @type {string}
   * @memberof SessionSeatsMessagesTopics
   */
  SESSION_SEAT_RESERVATION_CONFLICT = 'session-seats.seats.reservation-conflict',
}
