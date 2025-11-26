import { Body, Controller, Post, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ActiveDeveloper } from 'src/common/decorators/active-developer.decorator';
import type { ActiveDeveloperInterface } from 'src/common/interfaces/active-developer.interface';

@Controller('sys/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @ActiveDeveloper() developer: ActiveDeveloperInterface): Promise<ApiResponseDto<Project>> {
    const developerID = developer.developerId
    const project = await this.projectService.create(createProjectDto, developerID)
    return {
      data: project,
      message: 'Project created successfully',
      status: 201
    }
  }
}
