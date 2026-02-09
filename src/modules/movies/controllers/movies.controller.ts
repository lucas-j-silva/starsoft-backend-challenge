import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateMovieDto } from '../dtos';
import { MoviesService } from '../services';
import { MovieSchema } from '../schemas';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MovieApiSchema } from '../swagger/schemas/movie-api.schema';

/**
 * Controller responsible for handling HTTP requests related to movies.
 * Provides endpoints for creating and retrieving movie resources.
 *
 * @class MoviesController
 * @decorator @Controller('movies') - Maps this controller to the '/movies' route prefix.
 *
 * @example
 * // POST /movies - Create a new movie
 * // GET /movies/:id - Retrieve a movie by its ID
 */
@Controller('movies')
export class MoviesController {
  /**
   * Creates an instance of MoviesController.
   *
   * @param {MoviesService} moviesService - The service responsible for movie business logic operations.
   */
  constructor(private readonly moviesService: MoviesService) {}

  /**
   * Creates a new movie resource.
   *
   * @async
   * @param {CreateMovieDto} createMovieDto - The data transfer object containing movie creation details.
   * @returns {Promise<MovieSchema>} A promise that resolves to the newly created movie entity.
   * @throws {UnableToCreateMovieException} When the movie cannot be created.
   *
   * @example
   * // POST /movies
   * // Request body: { "name": "Inception", "description": "A mind-bending thriller" }
   * // Response: { "id": "uuid", "name": "Inception", "description": "A mind-bending thriller", ... }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new movie',
    description: 'Creates a new movie with the given name and description',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The movie has been successfully created.',
    type: MovieApiSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The movie cannot be created.',
  })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieSchema> {
    return this.moviesService.create(createMovieDto);
  }

  /**
   * Retrieves a movie by its unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the movie to retrieve.
   * @returns {Promise<MovieSchema>} A promise that resolves to the found movie entity.
   * @throws {MovieNotFoundException} When the movie with the specified ID is not found.
   *
   * @example
   * // GET /movies/550e8400-e29b-41d4-a716-446655440000
   * // Response: { "id": "550e8400-e29b-41d4-a716-446655440000", "name": "The Matrix", ... }
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find a movie by ID',
    description: 'Retrieves a movie by its unique identifier',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The movie has been successfully retrieved.',
    type: MovieApiSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The movie with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  async findById(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<MovieSchema> {
    return this.moviesService.findById(id);
  }
}
