import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for creating a new movie.
 * Used to validate the incoming request body when creating a movie.
 *
 * @class CreateMovieDto
 *
 * @example
 * const dto = new CreateMovieDto({
 *   name: 'Inception',
 *   description: 'A mind-bending thriller about dream infiltration'
 * });
 */
@ApiSchema({
  name: 'CreateMovieDto',
  description: 'Data Transfer Object for creating a new movie',
})
export class CreateMovieDto {
  /**
   * The name of the movie.
   * Must be a non-empty string with a maximum length of 128 characters.
   *
   * @type {string}
   * @memberof CreateMovieDto
   *
   * @example
   * 'Inception'
   */
  @ApiProperty({
    description: 'The name of the movie',
    example: 'Inception',
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  name: string;

  /**
   * The description of the movie.
   * Must be a non-empty string with a maximum length of 255 characters.
   *
   * @type {string}
   * @memberof CreateMovieDto
   *
   * @example
   * 'A mind-bending thriller about dream infiltration'
   */
  @ApiProperty({
    description: 'The description of the movie',
    example: 'A mind-bending thriller about dream infiltration',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  /**
   * Creates a new instance of CreateMovieDto.
   *
   * @param {Partial<CreateMovieDto>} data - The data to create the instance from
   */
  constructor(data: Partial<CreateMovieDto>) {
    Object.assign(this, data);
  }
}
