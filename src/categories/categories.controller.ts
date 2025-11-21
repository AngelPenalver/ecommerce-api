import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { ApiResponseDto } from "src/common/dto/api-response.dto";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ApiResponseDto<Category>> {
    const category = await this.categoriesService.create(createCategoryDto)

    return {
      message: 'Category created successfully',
      status: HttpStatus.CREATED,
      data: category
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ApiResponseDto<Category[]>> {
    const categories = await this.categoriesService.findAll()

    return {
      message: 'Categories found successfully',
      status: HttpStatus.OK,
      data: categories
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<Category>> {
    const category = await this.categoriesService.findOne(id)

    return {
      message: 'Category found successfully',
      status: HttpStatus.OK,
      data: category
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto): Promise<ApiResponseDto<Category>> {
    const category = await this.categoriesService.update(id, updateCategoryDto)

    return {
      message: 'Category updated successfully',
      status: HttpStatus.OK,
      data: category
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number): Promise<ApiResponseDto<Category>> {
    await this.categoriesService.remove(id)

    return {
      message: 'Category deleted successfully',
      status: HttpStatus.OK,
    }
  }

}
