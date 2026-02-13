import { Module } from '@nestjs/common';
import { MoviesUseCases } from './use-cases';
import { MoviesService } from './services';
import { DatabaseModule } from '../../shared/database/database.module';
import { MoviesController } from './controllers';
import { MoviesRepository } from './repositories';

/**
 * NestJS module that encapsulates all movie-related functionality.
 * This module provides controllers, services, and use cases for managing movie resources.
 *
 * @class MoviesModule
 * @decorator @Module - Defines this class as a NestJS module with its dependencies and exports.
 *
 * @example
 * ```typescript
 * // Import in AppModule to enable movie functionality
 * import { MoviesModule } from './modules/movies/movies.module';
 *
 * @Module({
 *   imports: [MoviesModule],
 * })
 * export class AppModule {}
 *
 * ```
 */
@Module({
  imports: [DatabaseModule],
  controllers: [MoviesController],
  providers: [...MoviesUseCases, MoviesRepository, MoviesService],
  exports: [...MoviesUseCases, MoviesService],
})
export class MoviesModule {}
