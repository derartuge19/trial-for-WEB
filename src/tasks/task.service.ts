import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { UserService } from 'src/user/user.service'; // Import UserService
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly userService: UserService, // Inject UserService
  ) {}

  // Create a new task
  async create(createTaskDto: any): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  // Get all tasks
  async getAll(): Promise<Task[]> {
    return await this.taskModel.find().exec();
  }

  // Get a task by ID
  async getByID(id: Types.ObjectId): Promise<Task | null> {
    return await this.taskModel
      .findById(id)
      .populate('assignedTo') // Populates the assigned users
      .exec();
  }

  // Update an existing task
  async update(
    id: Types.ObjectId,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task | null> {
    return await this.taskModel
      .findByIdAndUpdate(id, { $set: updateTaskDto }, { new: true })
      .populate('assignedTo') // Populates the assigned users after update
      .exec();
  }

  // Delete a task by ID
  async delete(
    id: Types.ObjectId,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    return await this.taskModel.deleteOne({ _id: id });
  }

  // Add assignees to a task
  async addAssignees(taskId: string, userIds: string[]): Promise<Task | null> {
    const objectIds = userIds.map((id) => new Types.ObjectId(id)); // Convert user IDs to ObjectIds

    // Fetch full User objects based on ObjectId array
    const users = await this.userService.getUsersByIds(objectIds);

    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Ensure there are no duplicate users by using a Set
    task.assignedTo = Array.from(new Set([...task.assignedTo, ...users]));

    // Save the task after assigning users
    return await task.save();
  }
}
