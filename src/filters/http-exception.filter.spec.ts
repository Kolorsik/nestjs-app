import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';

const mockJson = jest.fn();

const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
}));

const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: jest.fn(),
}));

const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
};

describe('Http exception filter middleware', () => {
    let service: HttpExceptionFilter;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [HttpExceptionFilter],
        }).compile();

        service = module.get<HttpExceptionFilter>(HttpExceptionFilter);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Should be return exception', () => {
        const date = new Date();
        service.catch(
            new HttpException('Http exception', 404),
            mockArgumentsHost,
        );
        expect(mockHttpArgumentsHost).toBeCalledTimes(1);
        expect(mockHttpArgumentsHost).toBeCalledWith();
        expect(mockGetResponse).toBeCalledTimes(1);
        expect(mockGetResponse).toBeCalledWith();
        expect(mockStatus).toBeCalledTimes(1);
        expect(mockStatus).toBeCalledWith(404);
        expect(mockJson).toBeCalledTimes(1);
        expect(mockJson).toBeCalledWith({
            message: 'Http exception',
            path: undefined,
            statusCode: 404,
            timestamp: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
        });
    });
});
