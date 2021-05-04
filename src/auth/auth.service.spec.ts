import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
    rootMongooseTestModule,
    clearDatabase,
    closeInMongoConnection,
} from '../test-utils/mongo/mongoose-test-module';
import { UserSchema } from '../users/schemas/user.schema';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { UsersDBService } from '../database/users/users-db.service';

describe('AuthService', () => {
    let service: AuthService;
    let userService: UsersDBService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: 'TestUser', schema: UserSchema },
                ]),
                AuthModule,
            ],
        }).compile();

        userService = module.get<UsersDBService>(UsersDBService);
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(userService).toBeDefined();
    });

    it('Should be return validated user', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test45@mail.ru',
            password: '1234567890',
        };
        await userService.create(user);
        const validatedUser = await service.validateUser(
            user.email,
            user.password,
        );
        expect(validatedUser).not.toBeNull();
    });

    it('Should be return token', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test45@mail.ru',
            password: '1234567890',
        };
        const createdUser = await userService.create(user);
        const authUser: AuthUserDto = {
            _id: createdUser._id,
            name: createdUser.name,
            age: createdUser.age,
            email: createdUser.email,
        };
        const token = await service.login(authUser);
        expect(token).not.toBeNull();
    });

    it('Should be return null (incorrect email)', async () => {
        const validatedUser = await service.validateUser(
            'email@mail.ru',
            '123',
        );
        expect(validatedUser).toBeNull();
    });

    it('Should be return null (incorrect password)', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test45@mail.ru',
            password: '1234567890',
        };
        await userService.create(user);
        const validatedUser = await service.validateUser(user.email, '123');
        expect(validatedUser).toBeNull();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeInMongoConnection();
    });
});
