import { IsArray, IsString } from 'class-validator';

export class UpdateTaskAssigneeDto {
  @IsArray()
  @IsString({ each: true }) // Validates each element in the array is a string
  usersIds: string[];
}
