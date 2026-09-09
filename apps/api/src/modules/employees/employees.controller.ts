import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Auth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('/')
  findAll(): Promise<EmployeeEntity[]> {
    return this.employeesService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<EmployeeEntity> {
    return this.employeesService.findOne(id);
  }

  @Post('/')
  create(@Body() dto: CreateEmployeeDto): Promise<EmployeeEntity> {
    return this.employeesService.create(dto);
  }

  @Put('/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<EmployeeEntity> {
    return this.employeesService.update(id, dto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<EmployeeEntity> {
    return this.employeesService.remove(id);
  }

  @Post('/:id/fire')
  fire(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserEntity,
  ): Promise<EmployeeEntity> {
    return this.employeesService.fire(id, user);
  }
}
