import { MovieApiSchema } from './movie.api-schema';
import { PaginationMetadataDto } from '../../../../shared/dtos/pagination-metadata.dto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'MoviesPaginationResultApiSchema',
  description: 'The schema for the pagination result of movies',
})
export class MoviesPaginationResultApiSchema {
  @ApiProperty({
    description: 'The data of the pagination result',
    type: [MovieApiSchema],
  })
  data: MovieApiSchema[];

  @ApiProperty({
    description: 'The metadata of the pagination result',
    type: PaginationMetadataDto,
  })
  metadata: PaginationMetadataDto;
}
