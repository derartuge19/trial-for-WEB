import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; // To help configure the static folder path
import { AppController } from './app.controller';
import { TaskModule } from './tasks/task.module';
import { AuthModule } from './user/auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), // Global config module
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager',
    ),
    TaskModule, // Task management module
    UserModule, // User management module
    AuthModule, // Authentication module

    // Serve static files (e.g., frontend assets like HTML, JS, CSS)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to the public folder
      serveRoot: '/', // The root path for static files
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
