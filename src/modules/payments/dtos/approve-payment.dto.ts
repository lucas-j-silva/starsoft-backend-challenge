import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApprovePaymentDto {
  @IsNotEmpty()
  @IsUUID()
  idOrExternalId: string;

  constructor(data: Partial<ApprovePaymentDto>) {
    Object.assign(this, data);
  }
}
