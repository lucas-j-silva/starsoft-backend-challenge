import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { ListMoviesWithPaginationDto } from '../dtos';
import { MovieSchema } from '../schemas';

export interface IListMoviesWithPaginationUseCase {
  execute(
    dto: ListMoviesWithPaginationDto,
  ): Promise<PaginationResultDto<MovieSchema>>;
}
