import { randomUUID } from 'crypto';

/**
 * Helper class for generating UUIDs.
 * This class is abstract and provides only static methods.
 *
 * @abstract
 * @class UUIDGeneratorHelper
 */
export abstract class UUIDGeneratorHelper {
  /**
   * Generates a new UUID (Universally Unique Identifier) using the crypto module.
   *
   * @static
   * @returns {string} A randomly generated UUID v4 string.
   *
   * @example
   * const id = UUIDGeneratorHelper.generateUUID();
   * // Returns something like: '550e8400-e29b-41d4-a716-446655440000'
   */
  static generateUUID(): string {
    return randomUUID();
  }
}
