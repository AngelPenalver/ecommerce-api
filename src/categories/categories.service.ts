import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoriesRepository: Repository<Category>) { }

  /**
   * Create categories for products
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }


  /**
   * Get all categories
   */
  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  
  /**
   * Get a category by ID
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return category
  }


  /**
   * Update a category
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const result = await this.categoriesRepository.update(id, updateCategoryDto)

    if (result.affected === 0) {
      throw new NotFoundException('Category not found')
    }

    const category = await this.findOne(id)

    return category
  }


  /**
   * Remove a category
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.categoriesRepository.softDelete(id)

    if (result.affected === 0) {
      throw new NotFoundException('Category not found')
    }

    return true

  }


  /**
   * Validate that categories exist by IDs
   */
  async validateCategoriesExist(ids: number[]): Promise<Category[]> {

    if (!ids || ids.length === 0) return [];

    const uniqueIds = [...new Set(ids)];

    const foundCategories = await this.categoriesRepository.findBy({
      id: In(uniqueIds),
    });

    if (foundCategories.length !== uniqueIds.length) {
      const foundIds = foundCategories.map(c => c.id);
      const missingIds = uniqueIds.filter(id => !foundIds.includes(id));

      throw new NotFoundException(`Categories not found: ${missingIds.join(', ')}`);
    }

    return foundCategories;
  }
}
