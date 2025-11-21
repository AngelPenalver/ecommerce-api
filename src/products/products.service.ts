import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ResponseProductDto } from './dto/response-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) { }


  async create(createProductDto: CreateProductDto): Promise<Product> {

    const product = this.productRepository.create(createProductDto)

    const productSave = await this.productRepository.save(product)

    return productSave
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const result = await this.productRepository.update(id, updateProductDto);

    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }

    const productFound = await this.findOne(id);

    return productFound
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.productRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }

    return true
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find()

  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product
  }

}
