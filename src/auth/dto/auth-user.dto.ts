import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Role } from '../roles/role.enum';

export class AuthUserDto {
    @ApiProperty()
    @IsString()
    readonly _id: string;

    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsNumber()
    readonly age: number;

    @ApiProperty()
    @IsString()
    readonly email: string;

    @ApiProperty()
    readonly roles?: Role[];
}
