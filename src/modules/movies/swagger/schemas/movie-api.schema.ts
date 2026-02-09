import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'MovieSchema',
  description: 'The schema for the movie entity',
})
export class MovieApiSchema {
  @ApiProperty({
    description: 'The ID of the movie',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the movie',
    example: 'Inception',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the movie',
    example: 'A mind-bending thriller about dream infiltration',
  })
  description: string;

  @ApiProperty({
    description: 'The created at timestamp of the movie',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at timestamp of the movie',
  })
  updatedAt: Date;
}
