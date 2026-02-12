import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableShutdownHooks();
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Starsoft Backend Challenge')
    .setDescription('The Starsoft Backend Challenge API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // const OpenApiSpecification =

  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  );
  // SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const consumerApp = app.connectMicroservice<KafkaOptions>({
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

bootstrap();
