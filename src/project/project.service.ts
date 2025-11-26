import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectService {
    constructor(@InjectRepository(Project) private projectsRepository: Repository<Project>) { }

    async create(createProjectDto: CreateProjectDto, ownerId: string) {
        const projectExists = await this.projectsRepository.findOne({
            where: {
                name: createProjectDto.name,
                owner: { id: ownerId }
            }
        })
        if (projectExists) {
            throw new ConflictException('You already have a project with that name')

        }

        const api_key = `pk_live_${uuidv4().replace(/-/g, '')}`

        const project = this.projectsRepository.create({
            ...createProjectDto,
            api_key,
            owner: { id: ownerId }
        })

        return this.projectsRepository.save(project)
    }

}
