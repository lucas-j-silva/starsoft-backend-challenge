import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

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

  await app.listen(process.env.PORT ?? 3333);
}

bootstrap();
