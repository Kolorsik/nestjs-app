import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    readonly age: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}
