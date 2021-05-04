import { IsNumber, IsString } from 'class-validator';
import { Role } from '../roles/role.enum';

export class PayloadDto {
    @IsString()
    readonly name: string;

    @IsNumber()
    readonly age: number;

    @IsString()
    readonly email: string;

    @IsString()
    readonly sub: string;

    readonly roles: Role[];
}
