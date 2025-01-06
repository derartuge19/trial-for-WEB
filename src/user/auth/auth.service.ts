import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BcryptService } from 'src/modules/bcrypt/bcrypt.service';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/login-user.dto';
import { SignupUserDto } from '../dto/signup-user.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { EmailNotificationService } from '../notifications/email-notification.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
    private emailNotificationService: EmailNotificationService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Validate the user's login credentials
  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findOne(loginUserDto.username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const passwordMatch = await this.bcryptService.comparePassword(
      loginUserDto.password,
      user.password,
    );
    if (passwordMatch) {
      return { message: 'Authentication successful', statusCode: 200 };
    } else {
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    }
  }

  // Handle user login and JWT token generation
  async login(loginUserDto: LoginUserDto) {
    try {
      await this.validateUser(loginUserDto);
      const payload = { username: loginUserDto.username };

      const access_token = this.jwtService.sign(payload, {
        expiresIn: '1h',
      });

      return {
        access_token,
        message: 'Authentication successful',
        statusCode: 200,
      };
    } catch (error) {
      console.error(
        `Login error for user: ${loginUserDto.username}, Error: ${error.message}`,
      );
      throw error;
    }
  }

  // Handle user signup, check for existing user, create user, and send email notification
  async signup(signupUserDto: SignupUserDto) {
    const existingUser = await this.userModel.findOne({
      $or: [
        { username: signupUserDto.username },
        { email: signupUserDto.email },
      ],
    });

    if (existingUser) {
      throw new HttpException(
        'Username or email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.bcryptService.hashingPassword(
      signupUserDto.password,
    );

    const createdUser = new this.userModel({
      _id: new mongoose.Types.ObjectId(),
      name: {
        firstName: signupUserDto.firstName,
        lastName: signupUserDto.lastName,
      },
      username: signupUserDto.username,
      email: signupUserDto.email,
      password: hashedPassword,
    });

    const emailNotification = {
      from: this.configService.get<string>('SENDER'),
      to: createdUser.email,
      subject: 'Your account created successfully!',
      text: 'Your account has been created. Please explore our app to get started.',
    };

    try {
      if (await createdUser.save()) {
        await this.emailNotificationService.send(emailNotification);
        console.log(
          `User ${signupUserDto.username} created and email notification sent.`,
        );
        return { message: 'User created successfully', statusCode: 201 };
      }
    } catch (error) {
      console.error(
        `Signup error for user: ${signupUserDto.username}, email: ${signupUserDto.email}, Error: ${error.message}`,
      );
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
