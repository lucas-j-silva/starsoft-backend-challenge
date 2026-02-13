import { CreateMovieUseCase } from './create-movie.use-case';
import { FindMovieByIdUseCase } from './find-movie-by-id.use-case';
import { ListMoviesWithPaginationUseCase } from './list-movies-with-pagination.use-case';

export * from './create-movie.use-case';
export * from './find-movie-by-id.use-case';
export * from './list-movies-with-pagination.use-case';

export const MoviesUseCases = [
  CreateMovieUseCase,
  FindMovieByIdUseCase,
  ListMoviesWithPaginationUseCase,
];
