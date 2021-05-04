import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        default: 'test@email.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly username: string;

    @ApiProperty({
        default: 'password',
    })
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
