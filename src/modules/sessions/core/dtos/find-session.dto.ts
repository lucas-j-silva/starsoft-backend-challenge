import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindSessionDto {
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  id: string;
}
