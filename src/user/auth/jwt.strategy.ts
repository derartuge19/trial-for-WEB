import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service'; // Import the user service
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Ensure this matches your secret
    });
  }

  // This method is used to validate the JWT and extract user information
  async validate(payload: any) {
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }
    return { userId: payload.sub, username: payload.username }; // Return user info
  }
}
