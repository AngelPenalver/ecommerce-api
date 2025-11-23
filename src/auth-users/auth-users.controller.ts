import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { RegisterAuthDto } from "./dto/register-auth-users.dto";
import { LoginAuthDto } from "./dto/login-auth-users.dto";
import { AuthService } from "./auth-users.service";
import { ApiResponseDto } from "src/common/dto/api-response.dto";

@Controller('auth-users')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() registerAuthDto: RegisterAuthDto): Promise<ApiResponseDto<{ token: string }>> {

        const data = await this.authService.register(registerAuthDto);

        return {
            message: 'User created successfully',
            status: HttpStatus.CREATED,
            data: {
                token: data.accessToken,
            }
        }
    }

    @Post('login')
    async login(@Body() loginAuthDto: LoginAuthDto): Promise<ApiResponseDto<{ token: string }>> {
        const data = await this.authService.login(loginAuthDto);
        return {
            message: 'User logged in successfully',
            status: HttpStatus.OK,
            data: {
                token: data.accessToken,
            },
        }
    }

}
