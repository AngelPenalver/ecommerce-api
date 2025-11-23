import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class RegisterAuthDeveloperDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    name: string

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    email: string

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    password: string
}
