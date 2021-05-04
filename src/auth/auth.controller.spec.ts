import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
    rootMongooseTestModule,
    clearDatabase,
    closeInMongoConnection,
} from '../test-utils/mongo/mongoose-test-module';
import { UserSchema } from '../users/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthUserDto } from './dto/auth-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { UsersDBService } from '../database/users/users-db.service';
import * as express from 'express';

describe('AuthController', () => {
    let controller: AuthController;
    let userService: UsersDBService;
    let requestWithUser: express.Request;

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

        requestWithUser = {} as express.Request;
        userService = module.get<UsersDBService>(UsersDBService);
        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(userService).toBeDefined();
    });

    it('Should be return token', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test@mail.ru',
            password: '1234567890',
        };
        const createdUser = await userService.create(user);
        const authUser: AuthUserDto = {
            _id: createdUser._id,
            name: createdUser.name,
            age: createdUser.age,
            email: createdUser.email,
        };
        requestWithUser.user = authUser;
        const userToken = await controller.login(requestWithUser);
        expect(userToken).not.toBeNull();
    });

    it('Should be return user', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test@mail.ru',
            password: '1234567890',
        };
        const createdUser = await userService.create(user);
        const authUser: AuthUserDto = {
            _id: createdUser._id,
            name: createdUser.name,
            age: createdUser.age,
            email: createdUser.email,
        };
        requestWithUser.user = authUser;
        const userProfile = await controller.getProfile(requestWithUser);
        expect(userProfile).not.toBeNull();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeInMongoConnection();
    });
});
