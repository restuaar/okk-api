import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const responseBody = exception.getResponse();
    console.log(exception);

    response.status(exception.getStatus()).json({
      errors: [responseBody],
    });
  }
}
