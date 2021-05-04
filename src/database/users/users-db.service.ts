import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { User, UserDocument } from '../../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../../users/dto/user.dto';
import { Role } from '../../auth/roles/role.enum';
import { UserRoleDto } from '../../users/dto/user-role.dto';

@Injectable()
export class UsersDBService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    async create(createUserDto: UserDto): Promise<User> {
        const user = await this.userModel.findOne({
            email: createUserDto.email,
        });
        if (user) {
            throw new HttpException('This email is already exist', 400);
        }
        const salt = await bcrypt.genSalt();
        const hashPass = await bcrypt.hash(createUserDto.password, salt);
        const createdUser = new this.userModel({
            name: createUserDto.name,
            email: createUserDto.email,
            age: createUserDto.age,
            password: hashPass,
            roles: ['user'],
        });
        return createdUser.save();
    }

    async getAll(): Promise<User[]> {
        return this.userModel.find();
    }

    async getByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email });
    }

    async getById(id: string): Promise<User> {
        if (!isValidObjectId(id)) {
            throw new HttpException('Invalid id', 400);
        }

        const user = await this.userModel.findOne({ _id: id });

        if (user) {
            return user;
        } else {
            throw new HttpException('User not found', 404);
        }
    }

    async partialUpdate(id: string, updatedUser: UpdateUserDto): Promise<User> {
        if (!isValidObjectId(id)) {
            throw new HttpException('Invalid id', 400);
        }

        if (
            updatedUser.age ||
            updatedUser.email ||
            updatedUser.name ||
            updatedUser.password
        ) {
            const user = await this.userModel.findOne({ _id: id });

            if (!user) {
                throw new HttpException('User not found', 404);
            }

            if (updatedUser.password) {
                const salt = await bcrypt.genSalt();
                updatedUser.password = await bcrypt.hash(
                    updatedUser.password,
                    salt,
                );
            }

            await this.userModel.findByIdAndUpdate(id, updatedUser);
            return this.userModel.findOne({ _id: user._id });
        } else {
            throw new HttpException('Invalid parameters', 400);
        }
    }

    async fullUpdate(id: string, updatedUser: UserDto): Promise<User> {
        if (!isValidObjectId(id)) {
            throw new HttpException('Invalid id', 400);
        }

        const user = await this.userModel.findOne({ _id: id });

        if (!user) {
            throw new HttpException('User not found', 404);
        }

        const salt = await bcrypt.genSalt();
        updatedUser.password = await bcrypt.hash(updatedUser.password, salt);
        await this.userModel.findByIdAndUpdate(id, updatedUser);
        return this.userModel.findOne({ _id: user._id });
    }

    async delete(id: string): Promise<User> {
        if (!isValidObjectId(id)) {
            throw new HttpException('Invalid id', 400);
        }

        const deletedUser = await this.userModel.findByIdAndDelete(id);

        if (deletedUser) {
            return deletedUser;
        } else {
            throw new HttpException('User not found', 404);
        }
    }

    async addRole(userRole: UserRoleDto): Promise<User> {
        if (!isValidObjectId(userRole.id)) {
            throw new HttpException('Invalid id', 400);
        }

        const user = await this.userModel.findOne({ _id: userRole.id });

        if (!user) {
            throw new HttpException('User not found', 404);
        }

        if (!Object.values(Role).includes(userRole.role as Role)) {
            throw new HttpException('Invalid role', 404);
        }

        if (user.roles.includes(userRole.role as Role)) {
            throw new HttpException(
                `User already have ${userRole.role} role`,
                404,
            );
        }

        user.roles.push(userRole.role as Role);
        return user.save();
    }

    async removeRole(userRole: UserRoleDto): Promise<User> {
        if (!isValidObjectId(userRole.id)) {
            throw new HttpException('Invalid id', 400);
        }

        const user = await this.userModel.findOne({ _id: userRole.id });

        if (!user) {
            throw new HttpException('User not found', 404);
        }

        if (!Object.values(Role).includes(userRole.role as Role)) {
            throw new HttpException('Invalid role', 404);
        }

        if (!user.roles.includes(userRole.role as Role)) {
            throw new HttpException(
                `User dont have ${userRole.role} role`,
                404,
            );
        }

        // eslint-disable-next-line prettier/prettier
        user.roles = user.roles.filter(role => role !== (userRole.role as Role));

        return user.save();
    }
}
