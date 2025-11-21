import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>, private readonly categoriesService: CategoriesService) { }

  /**
   * Create product with validated categories
   */

  async create(createProductDto: CreateProductDto): Promise<Product> {

    const categoriesFormated = await this.categoriesService.validateCategoriesExist(createProductDto.categories)

    const product = this.productRepository.create({
      ...createProductDto,
      categories: categoriesFormated
    })

    const productSave = await this.productRepository.save(product)

    return productSave
  }

  /**
   * Update product with validated categories
   */
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {

    const categoriesFormated = updateProductDto.categories ? await this.categoriesService.validateCategoriesExist(updateProductDto.categories) : undefined;

    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
      categories: categoriesFormated
    })
    
    if(!product){
      throw new NotFoundException('Product not found')
    }


    return await this.productRepository.save(product)
  }


  /**
   *  Delete product
   */

  async delete(id: number): Promise<boolean> {
    const result = await this.productRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }

    return true
  }

  /**
   * Find all products
   */

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find()

  }

  /**
   *  Find one products
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product
  }

}
