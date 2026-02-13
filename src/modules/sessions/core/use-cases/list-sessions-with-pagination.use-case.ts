/**
 * @fileoverview Use case for listing sessions with pagination.
 *
 * @description
 * This file contains the use case implementation for listing sessions with pagination.
 *
 * @module list-sessions-with-pagination.use-case
 */

import { IListSessionsWithPaginationUseCase } from '../interfaces';
import { ListSessionsWithPaginationDto } from '../dtos';
import { PaginationResultDto } from '../../../../shared/dtos/pagination-result.dto';
import { SessionSchema } from '../schemas';
import { SessionsRepository } from '../repositories';
import { Injectable } from '@nestjs/common';

/**
 * Use case for listing sessions with pagination.
 *
 * @implements {IListSessionsWithPaginationUseCase}
 */
@Injectable()
export class ListSessionsWithPaginationUseCase implements IListSessionsWithPaginationUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  /**
   * Executes the list sessions with pagination use case.
   *
   * @param {ListSessionsWithPaginationDto} pagination - The data transfer object containing the pagination parameters.
   * @returns {Promise<PaginationResultDto<SessionSchema>>} A promise that resolves to a paginated result containing session data.
   *
   * @example
   * const result = await listSessionsWithPaginationUseCase.execute({ page: 1, limit: 10 });
   * console.log(result.data); // Array of SessionSchema
   * console.log(result.metadata.totalPages); // Total number of pages
   */

  async execute(
    pagination: ListSessionsWithPaginationDto,
  ): Promise<PaginationResultDto<SessionSchema>> {
    const result = await this.sessionsRepository.listWithPagination(pagination);

    return result;
  }
}
