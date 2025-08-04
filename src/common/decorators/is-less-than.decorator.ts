import { ClassConstructor } from 'class-transformer';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export const IsLessThan = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => any,
  validationOptions?: ValidationOptions
) => {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsLessThanConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'Match' })
export class IsLessThanConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [propertyCallback] = args.constraints;
    const relatedValue = propertyCallback(args.object);

    // Check if the property to compare exists before performing validation
    if (relatedValue !== undefined && relatedValue !== null && value) {
      return value < relatedValue;
    }
    // If the property doesn't exist, skip validation
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const constraintPropertyName = relatedPropertyName.toString().replace(/^\((.*)\) => \1\./, '');
    return `${args.property} must be less than ${constraintPropertyName}`;
  }
}
