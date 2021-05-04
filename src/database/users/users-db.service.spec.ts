import { UsersDBService } from './users-db.service';
import {
    clearDatabase,
    closeInMongoConnection,
    rootMongooseTestModule,
} from '../../test-utils/mongo/mongoose-test-module';
import { UsersDBModule } from './users-db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../users/schemas/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '../../users/dto/user.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';

describe('UsersDBService', () => {
    let service: UsersDBService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: 'TestUser', schema: UserSchema },
                ]),
                UsersDBModule,
            ],
        }).compile();

        service = module.get<UsersDBService>(UsersDBService);
    });

    it('Should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Should be create user', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        const insertedUser = await service.create(user);
        const findedUser = await service.getById(insertedUser._id);
        expect(findedUser).not.toBeNull();
    });

    it('Should be return email already exist error', async () => {
        try {
            const user: UserDto = {
                name: 'Test',
                age: 35,
                email: 'test35@mail.ru',
                password: '1234567890',
            };
            await service.create(user);
            await service.create(user);
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('This email is already exist');
            expect(err.status).toBe(400);
        }
    });

    it('Should be return all users', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        await service.create(user);
        const user1: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test36@mail.ru',
            password: '1234567890',
        };
        await service.create(user1);
        const users = await service.getAll();
        expect(users.length).toBe(2);
    });

    it('Should be return user by id', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        const createdUser = await service.create(user);
        const findedUser = await service.getById(createdUser._id);
        expect(findedUser._id).toEqual(createdUser._id);
    });

    it('Should be return invalid id error (get user by id)', async () => {
        try {
            await service.getById('213');
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('Invalid id');
            expect(err.status).toBe(400);
        }
    });

    it('Should be return user bot found error (get user by id)', async () => {
        try {
            await service.getById('60828ae6a38d341e1c053800');
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('User not found');
            expect(err.status).toBe(404);
        }
    });

    it('Should be delete user', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        const createdUser = await service.create(user);
        const deletedUser = await service.delete(createdUser._id);
        expect(deletedUser).not.toBeNull();
    });

    it('Should be full user update', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        const createdUser = await service.create(user);
        const newUser: UserDto = {
            name: 'Test1',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        const updatedUser = await service.fullUpdate(createdUser._id, newUser);
        expect(updatedUser.name).toEqual(newUser.name);
    });

    it('Should be partial user update', async () => {
        const user: UserDto = {
            name: 'Test',
            age: 35,
            email: 'test35@mail.ru',
            password: '1234567890',
        };
        const createdUser = await service.create(user);
        const newUser: UpdateUserDto = { email: 'test@mail.ru' };
        const updatedUser = await service.partialUpdate(
            createdUser._id,
            newUser,
        );
        expect(updatedUser.email).toEqual(newUser.email);
    });

    it('Shoult be return invalid id error (partial user update)', async () => {
        try {
            const newUser: UpdateUserDto = { email: 'test@mail.ru' };
            await service.partialUpdate('123', newUser);
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('Invalid id');
            expect(err.status).toBe(400);
        }
    });

    it('Should be return user not found error (partial user update)', async () => {
        try {
            const newUser: UpdateUserDto = { email: 'test@mail.ru' };
            await service.partialUpdate('60828ae6a38d341e1c053800', newUser);
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('User not found');
            expect(err.status).toBe(404);
        }
    });

    it('Should be return invalid parameters error (partial update)', async () => {
        try {
            const newUser: UpdateUserDto = {};
            await service.partialUpdate('60828ae6a38d341e1c053800', newUser);
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('Invalid parameters');
            expect(err.status).toBe(400);
        }
    });

    it('Shoult be return invalid id error (full user update)', async () => {
        try {
            const newUser: UserDto = {
                name: 'Test1',
                age: 35,
                email: 'test35@mail.ru',
                password: '1234567890',
            };
            await service.fullUpdate('123', newUser);
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('Invalid id');
            expect(err.status).toBe(400);
        }
    });

    it('Should be return user not found error (full user update', async () => {
        try {
            const newUser: UserDto = {
                name: 'Test1',
                age: 35,
                email: 'test35@mail.ru',
                password: '1234567890',
            };
            await service.fullUpdate('60828ae6a38d341e1c053800', newUser);
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('User not found');
            expect(err.status).toBe(404);
        }
    });

    it('Should be return invalid id error (delete user)', async () => {
        try {
            await service.delete('123');
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('Invalid id');
            expect(err.status).toBe(400);
        }
    });

    it('Should be return user not found error (delete user)', async () => {
        try {
            await service.delete('60828ae6a38d341e1c053800');
            throw new Error('Error');
        } catch (err) {
            expect(err.message).toBe('User not found');
            expect(err.status).toBe(404);
        }
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeInMongoConnection();
    });
});
