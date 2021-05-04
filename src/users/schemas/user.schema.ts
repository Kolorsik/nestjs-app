import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Role } from '../../auth/roles/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
    @ApiProperty()
    _id?: string;

    @ApiProperty()
    @Prop()
    name: string;

    @ApiProperty()
    @Prop()
    age: number;

    @ApiProperty()
    @Prop()
    email: string;

    @ApiProperty()
    @Prop()
    password: string;

    @ApiProperty()
    @Prop()
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
