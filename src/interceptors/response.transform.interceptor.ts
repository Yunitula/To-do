import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidationError } from 'class-validator';
import mongoose from 'mongoose';
import { BSONError } from 'bson';

export interface Response<T> {
  statusCode: number;
  success: boolean;
  message: T;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private logger: Logger = new Logger('RESPONSE ERROR INTERCEPTOR');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        success: true,
        message: data.message,
        data: data.data,
      })),
      catchError((err) => {
        this.logger.log('Error :', err);
        console.log(err);
        const errorResponse = this.handleException(err);
        return throwError(new HttpException(errorResponse, errorResponse.statusCode));
      }),
    );
  }
  private handleException(err: any): Response<any> {
    const errorResponse: Response<any> = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: { reason: 'Internal Server Error', field: 'unknown' },
    };

    if (err instanceof ValidationError) {
      errorResponse.statusCode = HttpStatus.BAD_REQUEST;
      errorResponse.message.reason = Object.values(err.constraints || {})[0];
      errorResponse.message.field = err.property;
    } else if (err instanceof BadRequestException) {
      const messageObj = err.getResponse()?.['message'][0];
      errorResponse.statusCode = err.getStatus();
      errorResponse.message.reason = messageObj?.message || 'Bad Request';
      errorResponse.message.field = messageObj?.property || 'unknown';
    } else if (err instanceof mongoose.Error || err instanceof BSONError) {
      errorResponse.statusCode = HttpStatus.BAD_REQUEST;
      errorResponse.message.reason = err.message;
      errorResponse.message.field = err.name;
    } else if (err.code === 11000 || err.name === 'ValidationError') {
      errorResponse.statusCode = HttpStatus.BAD_REQUEST;
      errorResponse.message.reason = 'Duplicate field value entered';
      errorResponse.message.field = err.kind || 'unknown';
    } else if (err.error?.name === 'ValidationError') {
      const fields = Object.getOwnPropertyNames(err.error.errors);
      errorResponse.statusCode = HttpStatus.BAD_REQUEST;
      errorResponse.message.reason = `Duplicate field value entered: ${err._message}`;
      errorResponse.message.field = fields.toString();
    } else if (err.status) {
      errorResponse.statusCode = err.status;
      errorResponse.message.reason = err.response?.reason || err.message;
      errorResponse.message.field = err.response?.field || 'unknown';
    }

    return errorResponse;
  }
}
