import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from 'src/users/schemas/users.schemas';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
  ) {}

  async validateUserByEmail(email: string): Promise<any> {
    console.log('Validating user with email: ', email);

    const user = await this.usersService.findByEmail(email);

    if (user) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req): Promise<any> {
    if (!req.user) {
      throw new Error('Google login failed: No user information received.');
    }

    const { email, firstName, lastName, picture, googleId } = req.user;

    // Attempt to find the user by email
    let user = await this.userModel.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new one with partial information
      user = new this.userModel({
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        picture,
        googleId,
        isProfileComplete: false, // Mark profile as incomplete
      });
      await user.save();
    }

    // Generate JWT token for authenticated user
    const payload = { email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
