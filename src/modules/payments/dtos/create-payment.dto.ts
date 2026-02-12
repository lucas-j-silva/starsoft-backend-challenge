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
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  userId: string;

  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsInt({ message: 'validation.IS_INT' })
  @IsPositive({ message: 'validation.IS_POSITIVE' })
  amountInCents: number;

  @IsOptional()
  @IsDate({ message: 'validation.INVALID_DATE' })
  expiresAt?: Date;

  @IsOptional()
  @IsString({ message: 'validation.INVALID_STRING' })
  externalId?: string;
}
