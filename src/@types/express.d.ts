import { AuthUserDto } from '../auth/dto/auth-user.dto';

declare module 'express' {
    interface Request {
        user?: AuthUserDto;
    }
}
