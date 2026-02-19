/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @fileoverview Class decorator factory that enforces an "at least one of" validation rule.
 *
 * @description
 * This file exports AnyOf, a class decorator factory that applies
 * `class-validator`'s `ValidateIf` to each listed property so that a property
 * is required only when all other listed properties are `undefined`. This
 * effectively implements a "provide at least one" constraint: validation passes
 * as long as at least one property in the group has a value.
 *
 * @module any-of.validator
 */

import { applyDecorators } from '@nestjs/common';
import { ValidateIf } from 'class-validator';

/**
 * Class decorator factory that requires at least one of the specified properties.
 *
 * @description
 * For each property in `properties`, a `ValidateIf` decorator is applied that
 * activates validation for that property when either:
 * - The property itself is defined (the current value should be validated), OR
 * - All *other* listed properties are `undefined` (at least one must be present).
 *
 * This allows a DTO to accept any subset of the listed fields as long as at
 * least one of them is provided, without requiring all of them.
 *
 * @param {string[]} properties - An array of property names on the decorated
 *   class. At least one of these must be present in the incoming payload.
 * @returns A class decorator that applies the conditional
 *   validation logic to each property in the list.
 *
 * @example
 * // Require at least one of email or phoneNumber to be provided
 * @AnyOf(['email', 'phoneNumber'])
 * export class ContactDto {
 *   @IsEmail()
 *   email?: string;
 *
 *   @IsPhoneNumber()
 *   phoneNumber?: string;
 * }
 */
export function AnyOf(properties: string[]) {
  return function (target: any) {
    for (const property of properties) {
      const otherProps = properties.filter((prop) => prop !== property);
      const decorators = [
        // Validates if all other properties are undefined.
        ValidateIf(
          (obj: any) =>
            obj[property] !== undefined ||
            otherProps.reduce(
              (acc, prop) => acc && obj[prop] === undefined,
              true,
            ),
        ),
      ];

      for (const decorator of decorators) {
        applyDecorators(decorator)(target.prototype, property);
      }
    }
  };
}
