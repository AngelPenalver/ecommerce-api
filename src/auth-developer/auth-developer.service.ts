import { Injectable } from '@nestjs/common';
import { DeveloperService } from 'src/developer/developer.service';
import { Developer } from 'src/developer/entities/developer.entity';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from 'src/common/hashing/hashing.service';
import { LoginAuthDeveloperDto } from './dto/login-auth-developer.dto';
import { RegisterAuthDeveloperDto } from './dto/register-auth-developer.dto';

@Injectable()
export class AuthDeveloperService {
  constructor(
    private readonly developerService: DeveloperService,
    private readonly jwtServices: JwtService,
    private readonly hashingService: HashingService) { }

  /**
   * Login developer
   */
  async login(loginAuthDeveloperDto: LoginAuthDeveloperDto) {
    const developer = await this.validateDeveloper(loginAuthDeveloperDto)
    return this.generateToken(developer)
  }

  /**
   * Register developer
   */
  async register(registerAuthDeveloperDto: RegisterAuthDeveloperDto) {
    const developer = await this.developerService.create(registerAuthDeveloperDto)
    return this.generateToken(developer)
  }

  /**
   * Generate token
   */
  generateToken(developer: Developer) {
    const payload = {
      email: developer.email,
      developer_id: developer.id,
    }
    return {
      accessToken: this.jwtServices.sign(payload)
    }
  }

  /**
   * Validate credentials developer for login
   */
  async validateDeveloper(loginAuthDeveloperDto: LoginAuthDeveloperDto) {
    const { email, password } = loginAuthDeveloperDto
    const developer = await this.developerService.findOneByEmail(email)
    if (!developer) {
      throw new Error('Developer not found')
    }
    const isPasswordValid = await this.hashingService.compare(password, developer.password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }
    return developer
  }
}
