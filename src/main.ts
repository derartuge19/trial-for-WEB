import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());

  // Setup Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Task Management System')
    .setDescription(
      'Task management system built with Nest.js and MongoDB. Manage tasks, assign to a person, change status, and validate status change.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  await app.listen(7712);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
