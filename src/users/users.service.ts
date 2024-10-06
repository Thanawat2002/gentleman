import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schemas';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    try {
      const existingUser = await this.usersModel
        .findOne({ email: createUserDto.email })
        .exec();
      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }

      const createdUser = new this.usersModel(createUserDto);
      return createdUser.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByEmail(email: string): Promise<Users> {
    return this.usersModel.findOne({ email }).exec();
  }

  async findAll(): Promise<Users[]> {
    return this.usersModel.find().exec();
  }

  async findOne(id: string): Promise<Users> {
    return this.usersModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const result = await this.usersModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    return result;
  }

  async remove(id: string) {
    try {
      const result = await this.usersModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException('User not found');
      } else {
        return { message: 'User deleted successfully' };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
