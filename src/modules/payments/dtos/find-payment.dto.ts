import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class FindPaymentDto {
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  id: string;

  @IsOptional()
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  userId?: string;
}
