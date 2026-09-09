import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../users/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeEntity } from './employee.entity';

@Injectable()
export class EmployeesService {
  async findAll(): Promise<EmployeeEntity[]> {
    return await EmployeeEntity.find();
  }

  async findOne(id: string): Promise<EmployeeEntity> {
    const employee = await EmployeeEntity.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return employee;
  }

  async create({ pesel, ...rest }: CreateEmployeeDto): Promise<EmployeeEntity> {
    const isPeselTaken: boolean = await EmployeeEntity.existsBy({ pesel });
    if (isPeselTaken) throw new ConflictException('Pesel is already taken');

    const employee: EmployeeEntity = EmployeeEntity.create({ pesel, ...rest });

    return await employee.save();
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<EmployeeEntity> {
    const employee = await this.findOne(id);
    Object.assign(employee, dto);
    return await employee.save();
  }

  async remove(id: string): Promise<EmployeeEntity> {
    const employee = await this.findOne(id);
    return await employee.remove();
  }

  async fire(id: string, firedBy: UserEntity): Promise<EmployeeEntity> {
    const employee = await this.findOne(id);
    employee.firedBy = firedBy;
    await employee.softRemove();
    return employee;
  }
}
