import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

import { User, UserSchema } from '../schema/user.schema';
import { UserService } from '../user.service';
import { NotificationModule } from '../notifications/notification.module';
import { BcryptService } from '../../modules/bcrypt/bcrypt.service'; // Updated import path

@Module({
  imports: [
    ConfigModule, // Import ConfigModule to use environment variables
    PassportModule.register({ defaultStrategy: 'jwt' }), // Default authentication strategy
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultSecret',
        signOptions: { expiresIn: '1h' }, // JWT expiration time
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    BcryptService,
    LocalStrategy,
    JwtStrategy,
    BcryptService,
    UserService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
