import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApprovePaymentDto {
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  idOrExternalId: string;

  constructor(data: Partial<ApprovePaymentDto>) {
    Object.assign(this, data);
  }
}
