import { Product } from "../entities/product.entity";

export class ResponseProductDto {
    message: string;
    status: number;
    data?: Product;
}