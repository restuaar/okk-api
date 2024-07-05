import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  protected flattenValidationErrors(validationErrors: ValidationError[]): any {
    const result = {};

    for (const error of validationErrors) {
      for (const constraintKey in error.constraints) {
        if (error.constraints.hasOwnProperty(constraintKey)) {
          result[error.property] = error.constraints[constraintKey];
        }
      }
    }

    return result;
  }

  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const errors = this.flattenValidationErrors(validationErrors);
      return new BadRequestException({
        status: 400,
        type: 'BadRequestException',
        message: errors,
        report_url: 'https://github.com/restuaar',
      });
    };
  }
}
