import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenDto } from './dto/token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Role } from './roles/role.enum';
import * as express from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @ApiBody({
        description: 'Login and password to get access toker',
        type: LoginUserDto,
    })
    @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
    @ApiCreatedResponse({
        description: 'Get access token using email and password',
        type: TokenDto,
    })
    @Post('login')
    async login(@Request() req: express.Request): Promise<TokenDto> {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard(Role.User))
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid token' })
    @ApiOkResponse({
        description: 'Get user information using token',
        type: AuthUserDto,
    })
    @Get('profile')
    async getProfile(@Request() req: express.Request): Promise<AuthUserDto> {
        return req.user;
    }
}
