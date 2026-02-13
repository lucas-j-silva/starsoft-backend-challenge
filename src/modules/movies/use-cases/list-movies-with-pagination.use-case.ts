import { ListMoviesWithPaginationDto } from '../dtos';
import { MovieSchema } from '../schemas';
import { MoviesRepository } from '../repositories';
import { Injectable } from '@nestjs/common';
import { IListMoviesWithPaginationUseCase } from '../interfaces/list-movies-with-pagination.use-case.interface';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';

@Injectable()
export class ListMoviesWithPaginationUseCase implements IListMoviesWithPaginationUseCase {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async execute(
    dto: ListMoviesWithPaginationDto,
  ): Promise<PaginationResultDto<MovieSchema>> {
    const result = await this.moviesRepository.listWithPagination(dto);

    return result;
  }
}
