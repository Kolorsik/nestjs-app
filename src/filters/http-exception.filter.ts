import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorInfoDto } from './dto/error-info.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const exceptionInfo: ErrorInfoDto = exception.getResponse() as ErrorInfoDto;

        const date = new Date();

        response.status(exception.getStatus()).json({
            statusCode: exception.getStatus(),
            message: exceptionInfo.message
                ? exceptionInfo.message
                : exceptionInfo,
            error: exceptionInfo.error,
            timestamp: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
            path: request?.originalUrl,
        });
    }
}
