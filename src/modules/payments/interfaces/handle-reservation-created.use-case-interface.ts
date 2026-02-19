/**
 * @fileoverview Interface defining the contract for the Handle Reservation Created use case.
 *
 * @description
 * This file declares the interface that any Handle Reservation Created use case
 * implementation must satisfy, ensuring a consistent API for processing
 * reservation created Kafka events and creating linked payment records.
 *
 * @module handle-reservation-created.use-case-interface
 */

import { ReservationCreatedMessage } from '../../sessions/seats/events/messages';

/**
 * Interface defining the contract for the Handle Reservation Created use case.
 * Implements the use case pattern for reacting to reservation created events
 * and orchestrating the creation of associated payment entities.
 *
 * @interface IHandleReservationCreatedUseCase
 *
 * @example
 * class HandleReservationCreatedUseCase implements IHandleReservationCreatedUseCase {
 *   async execute(payload: ReservationCreatedMessage): Promise<void> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IHandleReservationCreatedUseCase {
  /**
   * Executes the handle reservation created use case.
   *
   * @param {ReservationCreatedMessage} payload - The Kafka message payload containing reservation details.
   * @returns {Promise<void>} A promise that resolves when the payment has been created and the event emitted.
   *
   * @example
   * await handleReservationCreatedUseCase.execute({
   *   id: 'reservation-uuid',
   *   sessionId: 'session-uuid',
   *   sessionSeatId: 'seat-uuid',
   *   userId: 'user-uuid',
   *   expiresAt: new Date('2026-03-01T00:05:00Z'),
   *   createdAt: new Date(),
   * });
   */
  execute(payload: ReservationCreatedMessage): Promise<void>;
}
