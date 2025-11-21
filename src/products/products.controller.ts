import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ApiResponseDto } from "src/common/dto/api-response.dto";
import { Product } from "./entities/product.entity";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body()createProductDto: CreateProductDto): Promise<ApiResponseDto<Product>>{

    const product = await this.productsService.create(createProductDto)

    return {
      message: 'Product created successfully',
      status: HttpStatus.CREATED,
      data: product
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ApiResponseDto<Product[]>>{
    const product = await this.productsService.findAll()
    return {
      message: 'Products found successfully',
      status: HttpStatus.OK,
      data: product
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<Product>>{
    const product = await this.productsService.findOne(id)
    return {
      message: 'Product found successfully',
      status: HttpStatus.OK,
      data: product
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<ApiResponseDto<Product>>{
    const product = await this.productsService.update(id, updateProductDto)
    return {
      message: 'Product updated successfully',
      status: HttpStatus.OK,
      data: product
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number): Promise<ApiResponseDto<void>>{
    await this.productsService.delete(id)
    return {
      message: 'Product deleted successfully',
      status: HttpStatus.OK,
    }
  }

}
