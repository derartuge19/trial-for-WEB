import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Types } from 'mongoose'; // Import Types from mongoose

@Controller('tasks') // Set a base route for all task-related endpoints
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Get all tasks
  @Get()
  async getTasks() {
    return this.taskService.getAll();
  }

  // Get a task by ID
  @Get(':id') // No need to specify /tasks/ explicitly in each endpoint
  async getTaskByID(@Param('id') id: string) {
    // Convert string to ObjectId for proper querying
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const objectId = new Types.ObjectId(id); // Convert string to ObjectId
    return this.taskService.getByID(objectId);
  }

  // Create a new task
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  // Update a task by ID
  @Put(':id')
  async update(
    @Param('id') id: string, // Handle input as string for consistency
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    // Convert string to ObjectId for proper querying
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const objectId = new Types.ObjectId(id);
    return this.taskService.update(objectId, updateTaskDto);
  }

  // Delete a task by ID
  @Delete(':id')
  async delete(@Param('id') id: string) {
    // Convert string to ObjectId for proper querying
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const objectId = new Types.ObjectId(id);
    return this.taskService.delete(objectId);
  }
}
