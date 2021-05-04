import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendMailDto {
    @ApiProperty({
        default: ['test@mail.com'],
    })
    @IsNotEmpty()
    @IsString({ each: true })
    @IsEmail({}, { each: true })
    readonly to: string[];

    @ApiProperty({
        default: 'Hello',
    })
    @IsNotEmpty()
    @IsString()
    readonly subject: string;

    @ApiProperty({
        default: 'Hello my dear friend :)',
    })
    @IsNotEmpty()
    @IsString()
    readonly message: string;
}
