/**
 * @fileoverview Custom parameter decorator for injecting the Drizzle database client.
 *
 * @description
 * This file exports the InjectDatabase decorator factory, which is a thin
 * convenience wrapper around NestJS's built-in `@Inject()` bound to the
 * `DB_PROVIDER` token. Using this decorator keeps injection sites readable and
 * decoupled from the raw token string.
 *
 * @module database.decorator
 */

import { Inject } from '@nestjs/common';
import { DB_PROVIDER } from './database.provider';

/**
 * Parameter decorator that injects the Drizzle database client.
 *
 * @description
 * Shorthand for `@Inject(DB_PROVIDER)`. Apply it to a constructor parameter
 * to receive the configured {@link DatabaseClient} instance provided by
 * {@link DRIZZLE_PROVIDER}.
 *
 * @returns {ParameterDecorator} A NestJS parameter decorator bound to the
 *   `DB_PROVIDER` injection token.
 *
 * @example
 * // Inject the database client into a service
 * @Injectable()
 * export class MyService {
 *   constructor(
 *     @InjectDatabase() private readonly db: DatabaseClient,
 *   ) {}
 * }
 */
export const InjectDatabase = () => Inject(DB_PROVIDER);
