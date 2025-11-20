import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    @IsNotEmpty()
    role: string
}
