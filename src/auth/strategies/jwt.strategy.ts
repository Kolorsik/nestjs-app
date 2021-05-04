import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUserDto } from '../dto/auth-user.dto';
import { PayloadDto } from '../dto/payload.dto';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: PayloadDto): Promise<AuthUserDto> {
        return {
            _id: payload.sub,
            email: payload.email,
            name: payload.name,
            age: payload.age,
            roles: payload.roles,
        };
    }
}
