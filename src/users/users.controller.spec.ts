import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from './dto/user.dto';
import { UsersController } from './users.controller';
import {
    clearDatabase,
    closeInMongoConnection,
    rootMongooseTestModule,
} from '../test-utils/mongo/mongoose-test-module';
import { UsersModule } from './users.module';
import { UserSchema } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import * as express from 'express';

describe('UsersController', () => {
    let controller: UsersController;
    let requestWithUser: express.Request;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: 'TestUser', schema: UserSchema },
                ]),
                UsersModule,
            ],
        }).compile();

        requestWithUser = {} as express.Request;
        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('Should be create user', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test353@mail.ru',
            password: '1234567890',
        };
        const createdUser = await controller.createUser(user);
        expect(createdUser).not.toBeNull();
    });

    it('Should be return all users', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        await controller.createUser(user);
        const user1: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test36@mail.ru',
            password: '1234567890',
        };
        await controller.createUser(user1);
        const users = await controller.getAllUsers();
        expect(users.length).toBe(2);
    });

    it('Should be return user by id', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        const createdUser = await controller.createUser(user);
        const findedUser = await controller.getUserById(createdUser._id);
        expect(findedUser._id).toEqual(createdUser._id);
    });

    it('Should be full user update', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        const createdUser = await controller.createUser(user);
        const newUser: UserDto = {
            name: 'Test1',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        requestWithUser.user = {
            _id: createdUser._id,
            name: createdUser.name,
            age: createdUser.age,
            email: createdUser.email,
        };
        const updatedUser = await controller.fullUserUpdate(
            createdUser._id,
            newUser,
        );
        expect(updatedUser.name).toEqual(newUser.name);
    });

    it('Should be partial user update', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        const createdUser = await controller.createUser(user);
        const newUser: UpdateUserDto = { email: 'test@mail.ru' };
        requestWithUser.user = {
            _id: createdUser._id,
            name: createdUser.name,
            age: createdUser.age,
            email: createdUser.email,
        };
        const updatedUser = await controller.partialUserUpdate(
            createdUser._id,
            newUser,
        );
        expect(updatedUser.email).toEqual(newUser.email);
    });

    it('Should be delete user', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        const createdUser = await controller.createUser(user);
        requestWithUser.user = {
            _id: createdUser._id,
            name: createdUser.name,
            age: createdUser.age,
            email: createdUser.email,
        };
        const deletedUser = await controller.removeUser(createdUser._id);
        expect(deletedUser).not.toBeNull();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeInMongoConnection();
    });
});
