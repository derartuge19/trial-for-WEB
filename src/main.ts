import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS with specific origin (you can modify this as needed)
  app.enableCors();

  // Swagger configuration
=======
  // Enable CORS
  app.enableCors();

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());

  // Setup Swagger API documentation
>>>>>>> c4ea885d8e92973552c0d7dfdbfe0c0c23371359
  const config = new DocumentBuilder()
    .setTitle('Task Management System')
    .setDescription(
      'Task management system built with Nest.js and MongoDB. Manage tasks, assign to a person, change status, and validate status change.',
    )
    .setVersion('1.0')
    .addBearerAuth() // Optional: If using JWT authorization, add bearer token auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger endpoint at /api

  // Start the application
  await app.listen(7712);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
