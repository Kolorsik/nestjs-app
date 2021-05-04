import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const date = new Date();
        // eslint-disable-next-line prettier/prettier
        console.log(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] [${req.method}] [${req.originalUrl}]`);
        next();
    }
}
