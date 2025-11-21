import { IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;
}
