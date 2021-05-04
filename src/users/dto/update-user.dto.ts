import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    age?: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    password?: string;
}
