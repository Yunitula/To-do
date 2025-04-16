import { MongoError } from 'mongodb';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    switch (exception.code) {
      case 11000:
    }
  }
}
