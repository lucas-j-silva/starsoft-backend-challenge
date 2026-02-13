import { FindSessionDto } from '../dtos';
import { SessionSchema } from '../schemas';

export interface IFindSessionUseCase {
  execute(dto: FindSessionDto): Promise<SessionSchema>;
}
