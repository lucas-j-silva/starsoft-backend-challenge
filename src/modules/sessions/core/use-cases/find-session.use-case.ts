import { Injectable } from '@nestjs/common';
import { FindSessionDto } from '../dtos';
import { IFindSessionUseCase } from '../interfaces';
import { SessionsRepository } from '../repositories';
import { SessionSchema } from '../schemas';

@Injectable()
export class FindSessionUseCase implements IFindSessionUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(dto: FindSessionDto): Promise<SessionSchema> {
    const session = await this.sessionsRepository.findById(dto.id);

    return session;
  }
}
