import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PickType } from '@nestjs/swagger';

export class ListPaymentsWithPaginationAndFilterDto extends PaginationDto {
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  userId: string;

  @IsOptional({ message: 'validation.IS_OPTIONAL' })
  @IsEnum(PaymentStatus, { message: 'validation.INVALID_ENUM' })
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
