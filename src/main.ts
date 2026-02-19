import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './shared/exceptions/http-exception.filter';
import {
  I18nService,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableShutdownHooks();
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  const configService = app.get(ConfigService);
  const i18n = app.get<I18nService>(I18nService);

  const config = new DocumentBuilder()
    .setTitle('Starsoft Backend Challenge')
    .setDescription('The Starsoft Backend Challenge API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  );

  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
    new HttpExceptionFilter(i18n),
  );

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafka-consumer',
        brokers: configService.getOrThrow<string>('KAFKA_BROKERS').split(','),
      },
      consumer: {
        groupId: 'kafka-consumer-group',
        maxWaitTimeInMs: 1000,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3333);

  console.log(`Server is running on port ${process.env.PORT ?? 3333}`);
  console.log(
    `Docs are running on port http://localhost:${process.env.PORT ?? 3333}/docs`,
  );
}

void bootstrap();
