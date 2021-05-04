import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly role: string;
}
