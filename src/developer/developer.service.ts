import { Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Developer } from './entities/developer.entity';
import { HashingService } from 'src/common/hashing/hashing.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';


@Injectable()
export class DeveloperService {
  constructor(@InjectRepository(Developer) private developerRepository: Repository<Developer>,
    private readonly hashingService: HashingService) { }

  /**
   * Create a new developer
   */
  async create(createDeveloperDto: CreateDeveloperDto) {
    const { email } = createDeveloperDto
    const developerExists = await this.findOneByEmail(email)
    if (developerExists) {
      throw new ConflictException('Developer already exists')
    }
    const passwordHash = await this.hashingService.hash(createDeveloperDto.password)
    const developer = this.developerRepository.create({
      ...createDeveloperDto,
      password: passwordHash
    })
    return this.developerRepository.save(developer)
  }

  /**
   * Find a developer by email
   */
  async findOneByEmail(email: string) {
    return this.developerRepository.findOneBy({ email })
  }


}
