import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PickType } from '@nestjs/swagger';

export class ListPaymentsWithPaginationAndFilterDto extends PaginationDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
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
