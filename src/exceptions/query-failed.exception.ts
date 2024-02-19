import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError<any>, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    if (exception.driverError?.code === '23505') {
      response.status(status).json({
        statusCode: status,
        error: 'Bad Request',
        message: 'Email already in use'
      });
    }
  }
}
