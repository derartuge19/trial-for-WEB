import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Get user by ID
  async getById(id: string): Promise<User | null> {
    const objectId = new Types.ObjectId(id); // Convert string to ObjectId
    return await this.userModel.findById(objectId).exec();
  }

  // Find user by username (or another field)
  async findOne(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  // Update user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const objectId = new Types.ObjectId(id); // Convert string to ObjectId
    return await this.userModel
      .findByIdAndUpdate(objectId, updateUserDto, { new: true })
      .exec();
  }

  // Delete user by ID
  async delete(
    id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const objectId = new Types.ObjectId(id); // Convert string to ObjectId
    return await this.userModel.deleteOne({ _id: objectId });
  }

  // Get users by their ObjectIds
  async getUsersByIds(ids: Types.ObjectId[]): Promise<User[]> {
    return await this.userModel.find({ _id: { $in: ids } }).exec();
  }
}
