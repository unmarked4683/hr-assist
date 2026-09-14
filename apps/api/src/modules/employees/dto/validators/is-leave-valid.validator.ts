import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { CreateEmployeeDto } from '../create-employee.dto';

@ValidatorConstraint({ name: 'isValidLeaveRange', async: false })
export class IsLeaveValidConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const {
      leave: { base, current, overdue },
    } = args.object as CreateEmployeeDto;

    if (![20, 26].includes(base)) return false;
    // return current <= base && overdue <= current;
    return current === base && overdue <= base;
  }

  defaultMessage() {
    return 'Invalid leave range';
  }
}

export function IsLeaveValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsLeaveValidConstraint,
    });
  };
}
