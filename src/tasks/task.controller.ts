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

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Task CRUD (Create, Read, Update, Delete) Operations

  @Get('/tasks/')
  async getTasks() {
    return this.taskService.getAll();
  }

  @Get('/tasks/:id')
  async getTaskByID(@Param('id') id: string) {
    const objectId = new Types.ObjectId(id); // Convert string to ObjectId
    return this.taskService.getByID(objectId);
  }

  @Post('/tasks/')
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Put('/tasks/:id')
  async update(
    @Param('id') id: string, // Change to string to handle input as string
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const objectId = new Types.ObjectId(id); // Convert string to ObjectId
    return this.taskService.update(objectId, updateTaskDto);
  }

  @Delete('/tasks/:id')
  async delete(@Param('id') id: string) {
    // Change to string to handle input as string
    const objectId = new Types.ObjectId(id); // Convert string to ObjectId
    return this.taskService.delete(objectId);
  }
}
