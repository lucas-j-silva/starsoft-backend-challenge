import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PickType, ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'ListPaymentsWithPaginationAndFilterDto',
  description: 'The schema for the list payments with pagination and filter',
})
export class ListPaymentsWithPaginationAndFilterDto extends PaginationDto {
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  @ApiProperty({
    description: 'The user ID of the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @IsOptional({ message: 'validation.IS_OPTIONAL' })
  @IsEnum(PaymentStatus, { message: 'validation.INVALID_ENUM' })
  @ApiProperty({
    description: 'The status of the payment',
    example: 'PENDING',
    enum: PaymentStatus,
    required: false,
  })
  status?: PaymentStatus;

  constructor(data: Partial<ListPaymentsWithPaginationAndFilterDto>) {
    super();

    Object.assign(this, data);
  }
}

export class ListPaymentsWithPaginationAndFilterQueryDto extends PickType(
  ListPaymentsWithPaginationAndFilterDto,
  ['page', 'limit', 'status'],
) {}
