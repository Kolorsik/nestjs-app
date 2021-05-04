import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserSchema } from '../../users/schemas/user.schema';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users.service';
import {
    rootMongooseTestModule,
    clearDatabase,
    closeInMongoConnection,
} from '../../test-utils/mongo/mongoose-test-module';
import { LocalStrategy } from './local.strategy';
import { UserDto } from '../../users/dto/user.dto';
import { AuthModule } from '../auth.module';

describe('Logger middleware', () => {
    let service: LocalStrategy;
    let userService: UsersService;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: 'TestUser', schema: UserSchema },
                ]),
                UsersModule,
                AuthModule,
            ],
            providers: [LocalStrategy],
        }).compile();

        userService = module.get<UsersService>(UsersService);
        service = module.get<LocalStrategy>(LocalStrategy);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(userService).toBeDefined();
    });

    it('Should be return authenticated user', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test45@mail.ru',
            password: '1234567890',
        };
        await userService.create(user);
        const validatedUser = await service.validate(user.email, user.password);
        expect(validatedUser).not.toBeNull();
    });

    it('Should be return unauthorized exception', async () => {
        try {
            await service.validate('test@mail.ru', '123');
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('Unauthorized');
            expect(err.status).toBe(401);
        }
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeInMongoConnection();
    });
});
