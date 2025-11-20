import { Body, Controller, Post } from "@nestjs/common";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { ResponseDto } from "./dto/response-auth.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerAuthDto: RegisterAuthDto): Promise<ResponseDto> {
        return this.authService.register(registerAuthDto);
    }

    @Post('login')
    login(@Body() loginAuthDto: LoginAuthDto): Promise<ResponseDto> {
        return this.authService.login(loginAuthDto);
    }
  
}
