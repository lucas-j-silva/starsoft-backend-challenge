/**
 * @fileoverview Interface for the Reserve Session Seat use case.
 *
 * @description
 * This file contains the interface for the Reserve Session Seat use case.
 *
 * @module reserve-session-seat.use-case.interface
 */

import { ReserveSessionSeatDto } from '../dtos';
import { SessionSeatReservationSchema } from '../schemas';

/**
 * Interface for the Reserve Session Seat use case.
 *
 * @description
 * Defines the contract for use cases that reserve a session seat.
 * Implementations of this interface should reserve the session seat based on the provided criteria.
 *
 * @interface IReserveSessionSeatUseCase
 * @example
 * class ReserveSessionSeatUseCase implements IReserveSessionSeatUseCase {
 *   async execute(data: ReserveSessionSeatDto): Promise<SessionSeatReservationSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IReserveSessionSeatUseCase {
  /**
   * Executes the reserve session seat use case.
   *
   * @param {ReserveSessionSeatDto} data - The data transfer object containing the session seat reservation details.
   * @returns {Promise<SessionSeatReservationSchema>} A promise that resolves to the reserved session seat.
   */
  execute(data: ReserveSessionSeatDto): Promise<SessionSeatReservationSchema>;
}
