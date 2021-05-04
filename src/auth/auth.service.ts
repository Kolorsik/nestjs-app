import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from './dto/auth-user.dto';
import { PayloadDto } from './dto/payload.dto';
import { TokenDto } from './dto/token.dto';
import { UsersDBService } from '../database/users/users-db.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private UsersDBService: UsersDBService,
    ) {}

    async validateUser(email: string, password: string): Promise<AuthUserDto> {
        const user = await this.UsersDBService.getByEmail(email);
        if (!user) {
            return null;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (user && isMatch) {
            return {
                _id: user._id,
                name: user.name,
                age: user.age,
                email: user.email,
                roles: user.roles,
            };
        }
        return null;
    }

    async login(user: AuthUserDto): Promise<TokenDto> {
        const payload: PayloadDto = {
            name: user.name,
            age: user.age,
            email: user.email,
            sub: user._id,
            roles: user.roles,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
