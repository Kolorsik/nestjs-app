import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserRoleDto } from './dto/user-role.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UsersDBService } from '../database/users/users-db.service';

@Injectable()
export class UsersService {
    constructor(private UsersDBService: UsersDBService) {}

    async create(createUserDto: UserDto): Promise<User> {
        return this.UsersDBService.create(createUserDto);
    }

    async getAll(): Promise<User[]> {
        return this.UsersDBService.getAll();
    }

    async getById(id: string): Promise<User> {
        return this.UsersDBService.getById(id);
    }

    async partialUpdate(id: string, updatedUser: UpdateUserDto): Promise<User> {
        return this.UsersDBService.partialUpdate(id, updatedUser);
    }

    async fullUpdate(id: string, updatedUser: UserDto): Promise<User> {
        return this.UsersDBService.fullUpdate(id, updatedUser);
    }

    async delete(id: string): Promise<User> {
        return this.UsersDBService.delete(id);
    }

    async addRole(userRole: UserRoleDto): Promise<User> {
        return this.UsersDBService.addRole(userRole);
    }

    async removeRole(userRole: UserRoleDto): Promise<User> {
        return this.UsersDBService.removeRole(userRole);
    }
}
