import { Test, TestingModule } from '@nestjs/testing';
import { PayloadDto } from '../dto/payload.dto';
import { Role } from '../roles/role.enum';
import { JwtStrategy } from './jwt.strategy';

describe('Logger middleware', () => {
    let service: JwtStrategy;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [JwtStrategy],
        }).compile();

        service = module.get<JwtStrategy>(JwtStrategy);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Should be return authenticated user', async () => {
        const payload: PayloadDto = {
            name: 'Test',
            email: 'test@mail.ru',
            age: 35,
            sub: '213',
            roles: [Role.User],
        };
        const validatedUser = await service.validate(payload);
        expect(validatedUser).not.toBeNull();
    });
});
