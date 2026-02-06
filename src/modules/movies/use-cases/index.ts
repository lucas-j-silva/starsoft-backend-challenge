import { CreateMovieUseCase } from './create-movie.use-case';
import { FindMovieByIdUseCase } from './find-movie-by-id.use-case';

export * from './create-movie.use-case';
export * from './find-movie-by-id.use-case';

export const MoviesUseCases = [CreateMovieUseCase, FindMovieByIdUseCase];
