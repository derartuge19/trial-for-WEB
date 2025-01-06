import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task, TaskSchema } from './schemas/task.schema';
import { UpdateStatusController } from './update-status/update-status.controller';
import { UpdateStatusService } from './update-status/update-status.service';
import { UpdateAssigneeController } from './update-assignee/update-assignee.controller';
import { UpdateAssigneeService } from './update-assignee/update-assignee.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    UserModule,
  ],
  controllers: [
    TaskController,
    UpdateStatusController,
    UpdateAssigneeController,
  ],
  providers: [TaskService, UpdateStatusService, UpdateAssigneeService],
})
export class TaskModule {}
