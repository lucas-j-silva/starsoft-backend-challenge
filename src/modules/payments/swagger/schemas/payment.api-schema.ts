import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaymentStatus } from '../../enums/payment-status.enum';

@ApiSchema({
  name: 'PaymentApiSchema',
  description: 'The schema for the payment entity',
})
export class PaymentApiSchema {
  @ApiProperty({
    description: 'The ID of the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The user ID of the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'The amount of the payment',
    example: 100,
  })
  amountInCents: number;

  @ApiProperty({
    description: 'The status of the payment',
    example: 'PENDING',
  })
  status: PaymentStatus;

  @ApiProperty({
    description: 'The approved at timestamp of the payment',
    example: '2021-01-01T00:00:00.000Z',
  })
  approvedAt: Date;

  @ApiProperty({
    description: 'The expires at timestamp of the payment',
    example: '2021-01-01T00:00:00.000Z',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'The created at timestamp of the payment',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at timestamp of the payment',
    example: '2021-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The external ID of the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  externalId: string;
}
