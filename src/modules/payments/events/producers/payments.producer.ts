import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaymentsMessagesTopics } from '../enums/payments-messages-topics.enum';
import {
  PaymentApprovedMessage,
  PaymentCreatedMessage,
  PaymentExpiredMessage,
} from '../messages';

@Injectable()
export class PaymentsProducer {
  private readonly kafkaClient: ClientKafka;

  constructor(private readonly configService: ConfigService) {
    this.kafkaClient = new ClientKafka({
      producerOnlyMode: true,
      producer: {
        allowAutoTopicCreation: true,
      },
      client: {
        clientId: 'payments-producer-client',
        brokers: this.configService
          .getOrThrow<string>('KAFKA_BROKERS')
          .split(','),
      },
    });
  }

  async sendPaymentCreatedEvent(data: PaymentCreatedMessage): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit(PaymentsMessagesTopics.PAYMENT_CREATED, data),
    );
  }

  async sendPaymentApprovedEvent(data: PaymentApprovedMessage): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit(PaymentsMessagesTopics.PAYMENT_APPROVED, data),
    );
  }

  async sendPaymentExpiredEvent(data: PaymentExpiredMessage): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit(PaymentsMessagesTopics.PAYMENT_EXPIRED, data),
    );
  }
}
