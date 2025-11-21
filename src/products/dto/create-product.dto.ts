import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(25)
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @IsArray()
    @IsNotEmpty()
    categories: number[];

    @IsBoolean()
    @IsOptional()
    isActived?: boolean;
}
