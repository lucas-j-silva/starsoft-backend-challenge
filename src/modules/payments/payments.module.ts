import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../shared/database/database.module';
import { PaymentsReservationCreatedConsumer } from './events/consumers';
import { PaymentsUseCases } from './use-cases';
import { PaymentsService } from './services/payments.service';
import { PaymentsRepository } from './repositories/payments.repository';
import { PaymentsScheduler } from './schedulers';
import { PaymentsProducer } from './events/producers';
import { SessionsCoreModule } from '../sessions/core/sessions-core.module';
import { PaymentsController } from './controllers/payments.controller';

@Module({
  imports: [DatabaseModule, SessionsCoreModule],
  controllers: [
    // Consumers
    PaymentsReservationCreatedConsumer,
    // Controllers
    PaymentsController,
  ],
  providers: [
    // Use cases
    ...PaymentsUseCases,
    // Services
    PaymentsService,
    // Repositories
    PaymentsRepository,

    // Producers
    PaymentsProducer,
    // Schedulers
    PaymentsScheduler,
  ],
})
export class PaymentsModule {}
