/**
 * @fileoverview Cache service for session seats operations.
 *
 * @description
 * This service provides caching functionality for session seat reservations
 * and availability status using Redis as the underlying cache store.
 *
 * @module session-seats-cache.service
 */

import { Injectable } from '@nestjs/common';
import { CacheClientService } from 'src/shared/cache/cache-client.service';

/**
 * Service responsible for caching session seat reservations and availability.
 *
 * @class SessionSeatsCacheService
 *
 * @example
 * // Set a seat reservation with expiration
 * await sessionSeatsCacheService.setSeatReservation('reservation-123', new Date('2024-12-25T19:00:00'));
 *
 * // Check seat availability from cache
 * const isAvailable = await sessionSeatsCacheService.getSessionSeatAvailability('seat-456');
 */
@Injectable()
export class SessionSeatsCacheService {
  /**
   * Creates an instance of SessionSeatsCacheService.
   *
   * @param {CacheClientService} cacheClient - The cache client service for Redis operations.
   */
  constructor(private readonly cacheClient: CacheClientService) {}

  /**
   * Stores a seat reservation in the cache with automatic expiration.
   *
   * @param {string} reservationId - The unique identifier of the reservation.
   * @param {Date} expiresAt - The expiration date/time for the reservation.
   * @returns {Promise<void>} A promise that resolves when the reservation is cached.
   *
   * @example
   * const expiresAt = new Date(Date.now() + 30000); // 30 seconds from now
   * await sessionSeatsCacheService.setSeatReservation('res-123', expiresAt);
   */
  async setSeatReservation(
    reservationId: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.cacheClient
      .getInstance()
      .set(`reservation:${reservationId}`, expiresAt.toISOString(), {
        expiration: { type: 'PXAT', value: expiresAt.getTime() },
      });
  }

  /**
   * Retrieves a seat reservation expiration time from the cache.
   *
   * @param {string} reservationId - The unique identifier of the reservation.
   * @returns {Promise<Date | null>} The expiration date if found, null otherwise.
   *
   * @example
   * const expiresAt = await sessionSeatsCacheService.getSeatReservation('res-123');
   * if (expiresAt) {
   *   console.log(`Reservation expires at: ${expiresAt}`);
   * }
   */
  async getSeatReservation(reservationId: string): Promise<Date | null> {
    const expiresAt = await this.cacheClient
      .getInstance()
      .get(`reservation:${reservationId}`);

    if (!expiresAt) return null;

    return new Date(expiresAt);
  }

  /**
   * Stores the availability status of a session seat in the cache.
   *
   * @param {string} sessionSeatId - The unique identifier of the session seat.
   * @param {boolean} isAvailable - Whether the seat is available for reservation.
   * @param {Date} [expiresAt] - Optional expiration date for the cache entry (e.g., session start time).
   * @returns {Promise<void>} A promise that resolves when the availability is cached.
   *
   * @example
   * // Cache availability with expiration (until session starts)
   * await sessionSeatsCacheService.setSessionSeatAvailability(
   *   'seat-456',
   *   true,
   *   new Date('2024-12-25T19:00:00')
   * );
   *
   * // Cache availability without expiration
   * await sessionSeatsCacheService.setSessionSeatAvailability('seat-456', false);
   */
  async setSessionSeatAvailability(
    sessionSeatId: string,
    isAvailable: boolean,
    expiresAt?: Date,
  ): Promise<void> {
    await this.cacheClient.getInstance().set(
      `availability:${sessionSeatId}`,
      isAvailable.toString(),
      expiresAt
        ? {
            expiration: { type: 'PXAT', value: expiresAt.getTime() },
          }
        : undefined,
    );
  }

  /**
   * Retrieves the availability status of a session seat from the cache.
   *
   * @param {string} sessionSeatId - The unique identifier of the session seat.
   * @returns {Promise<boolean | null>} The availability status if cached, null if not found.
   *
   * @example
   * const isAvailable = await sessionSeatsCacheService.getSessionSeatAvailability('seat-456');
   * if (isAvailable !== null) {
   *   console.log(`Seat is ${isAvailable ? 'available' : 'not available'}`);
   * } else {
   *   console.log('Availability not cached, need to check database');
   * }
   */
  async getSessionSeatAvailability(
    sessionSeatId: string,
  ): Promise<boolean | null> {
    const isAvailable = await this.cacheClient
      .getInstance()
      .get(`availability:${sessionSeatId}`);

    return isAvailable ? Boolean(isAvailable) : null;
  }
}
