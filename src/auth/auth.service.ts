import {
  HttpStatus,
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { ResponseDto } from './dto/response-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Register a new user
    */
  async register(registerAuthDto: RegisterAuthDto): Promise<{accessToken: string}> {

      const { name, password, email } = registerAuthDto;

      const user = await this.userService.findByEmail(email);
      if (user) {
        throw new ConflictException('User already exists');
      }

      const passwordHash: string = await bcrypt.hash(password, 10);

      const userDto: CreateUserDto = {
        name,
        password: passwordHash,
        email,
        role: 'USER',
      };

      const newUser = await this.userService.create(userDto);

      const token = this.generateToken(newUser)

      return {accessToken: token}
  }

  /**
   * Login a user
   */
  async login(loginAuthDto: LoginAuthDto): Promise<{accessToken: string}>{

      const user = await this.validateUser(loginAuthDto);

      const token = this.generateToken(user);

      return {accessToken: token};
  }

  /**
   * Validate user credentials
   */

  async validateUser(loginAuthDto: LoginAuthDto): Promise<User> {
    const { email, password } = loginAuthDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  /**
   * Generate a token for a user
   */

  generateToken(user: User): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
