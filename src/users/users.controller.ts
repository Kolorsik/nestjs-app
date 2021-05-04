import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/roles/role.enum';
import { UserRoleDto } from './dto/user-role.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOkResponse({
        description: 'Get all users',
        type: [User],
    })
    @ApiBearerAuth()
    //@UseGuards(JwtAuthGuard, RolesGuard(Role.Manager))
    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.usersService.getAll();
    }

    @ApiOkResponse({
        description: 'Get user by id',
        type: User,
    })
    @ApiBadRequestResponse({ description: 'Invalid id' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiBearerAuth()
    //@UseGuards(JwtAuthGuard, RolesGuard(Role.Manager))
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<User> {
        return this.usersService.getById(id);
    }

    @ApiBadRequestResponse({ description: 'Invalid id' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiNotFoundResponse({ description: 'Invalid role' })
    @ApiNotFoundResponse({ description: 'User already have any role' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard(Role.Admin))
    @Post('role')
    async addRole(@Body() userRole: UserRoleDto): Promise<User> {
        return this.usersService.addRole(userRole);
    }

    @ApiCreatedResponse({
        description: 'Create user',
        type: User,
    })
    @ApiBadRequestResponse({ description: 'This email is already exist' })
    @Post()
    async createUser(@Body() createUserDto: UserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @ApiCreatedResponse({
        description: 'Full user update',
        type: User,
    })
    @ApiBadRequestResponse({ description: 'Invalid id' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiForbiddenResponse({ description: 'Forbidden resource' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard(Role.User))
    @Put(':id')
    async fullUserUpdate(
        @Param('id') id: string,
        @Body() updatedUser: UserDto,
    ): Promise<User> {
        return this.usersService.fullUpdate(id, updatedUser);
    }

    @ApiCreatedResponse({
        description: 'Partial user update',
        type: User,
    })
    @ApiBadRequestResponse({ description: 'Invalid id' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiForbiddenResponse({ description: 'Forbidden resource' })
    @ApiBadRequestResponse({ description: 'Invalid parameters' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard(Role.User))
    @Patch(':id')
    async partialUserUpdate(
        @Param('id') id: string,
        @Body() updatedBody: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.partialUpdate(id, updatedBody);
    }

    @ApiBadRequestResponse({ description: 'Invalid id' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiNotFoundResponse({ description: 'Invalid role' })
    @ApiNotFoundResponse({ description: 'User dont have any role' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard(Role.Admin))
    @Delete('role')
    async removeRole(@Body() userRole: UserRoleDto): Promise<User> {
        return this.usersService.removeRole(userRole);
    }

    @ApiCreatedResponse({
        description: 'Delete user',
        type: User,
    })
    @ApiBadRequestResponse({ description: 'Invalid id' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiForbiddenResponse({ description: 'Forbidden resource' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard(Role.User))
    @Delete(':id')
    async removeUser(@Param('id') id: string): Promise<User> {
        return this.usersService.delete(id);
    }
}
