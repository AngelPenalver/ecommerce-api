import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthDeveloperService } from './auth-developer.service';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { RegisterAuthDeveloperDto } from './dto/register-auth-developer.dto';
import { LoginAuthDeveloperDto } from './dto/login-auth-developer.dto';

@Controller('sys/auth')
export class AuthDeveloperController {
  constructor(private readonly authDeveloperService: AuthDeveloperService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerAuthDeveloperDto: RegisterAuthDeveloperDto): Promise<ApiResponseDto<{ accessToken: string }>> {
    const token = await this.authDeveloperService.register(registerAuthDeveloperDto)
    return {
      data: token,
      message: 'Developer registered successfully',
      status: HttpStatus.CREATED
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginAuthDeveloperDto: LoginAuthDeveloperDto): Promise<ApiResponseDto<{ accessToken: string }>> {
    const token = await this.authDeveloperService.login(loginAuthDeveloperDto)
    return {
      data: token,
      message: 'Developer logged in successfully',
      status: HttpStatus.OK
    }
  }

} 
