import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction, Request, Response } from 'express';
import { LoggerMiddleware } from './logger.middleware';

describe('Logger middleware', () => {
    let service: LoggerMiddleware;

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const nextFunction: NextFunction = jest.fn();

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoggerMiddleware],
        }).compile();

        service = module.get<LoggerMiddleware>(LoggerMiddleware);

        mockRequest = {};
        mockResponse = {};
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Should be log in console', () => {
        service.use(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );
        expect(nextFunction).toBeCalledTimes(1);
    });
});
