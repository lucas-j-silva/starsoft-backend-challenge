import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaymentApiSchema } from './payment.api-schema';
import { PaginationMetadataDto } from '../../../../shared/dtos/pagination-metadata.dto';

@ApiSchema({
  name: 'PaymentsPaginationResultApiSchema',
  description: 'The schema for the pagination result of payments',
})
export class PaymentsPaginationResultApiSchema {
  @ApiProperty({
    description: 'The data of the pagination result',
    type: [PaymentApiSchema],
  })
  data: PaymentApiSchema[];

  @ApiProperty({
    description: 'The metadata of the pagination result',
    type: PaginationMetadataDto,
  })
  metadata: PaginationMetadataDto;
}
