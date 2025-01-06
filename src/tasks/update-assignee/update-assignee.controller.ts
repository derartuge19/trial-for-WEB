import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UpdateAssigneeService } from './update-assignee.service';
import { UpdateTaskAssigneeDto } from '../dto/update-task-assignee.dto';
import { Task } from '../schemas/task.schema';

@Controller('tasks/assignee')
export class UpdateAssigneeController {
  constructor(private readonly updateAssigneeService: UpdateAssigneeService) {}

  @Get(':id')
  async getTaskAssignees(@Param('id') id: string): Promise<string[]> {
    return await this.updateAssigneeService.getAssignees(id);
  }

  @Put(':id')
  async updateTaskAssignee(
    @Param('id') id: string,
    @Body() updateTaskAssigneeDto: UpdateTaskAssigneeDto,
  ): Promise<Task> {
    return await this.updateAssigneeService.addAssignees(
      id,
      updateTaskAssigneeDto.usersIds,
    );
  }
}
