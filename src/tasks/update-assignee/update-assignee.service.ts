import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';

@Injectable()
export class UpdateAssigneeService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async getAssignees(taskId: string): Promise<string[]> {
    // Ensure returning string[]
    const task = await this.taskModel
      .findById(taskId)
      .populate('assignedTo', 'username') // Only select the username field
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task.assignedTo.map((user) => user.username); // Return usernames as strings
  }

  async addAssignees(taskId: string, userIds: string[]): Promise<Task> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(
      taskId,
      { $set: { assignedTo: userIds } },
      { new: true },
    );
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return updatedTask;
  }
}
