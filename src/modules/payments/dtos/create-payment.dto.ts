import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  amountInCents: number;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;

  @IsOptional()
  @IsString()
  externalId?: string;
}
