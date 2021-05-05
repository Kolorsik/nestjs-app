import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    age?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    password?: string;
}
