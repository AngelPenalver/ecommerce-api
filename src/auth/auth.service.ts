import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResponseDto } from './dto/response-auth.dto';


@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService){}

  async register(registerAuthDto: RegisterAuthDto): Promise<ResponseDto>{
    const {name, password, email} = registerAuthDto
    
    const user =  await this.userService.findByEmail(email)
    if(user){
      throw new Error('User already exists')
    }

    const userDto: CreateUserDto = {
      name,
      password,
      email,
      role: 'USER'
    }


    const newUser = await this.userService.create(userDto)

    return {
      message: 'User created successfully',
      status: HttpStatus.CREATED,
      data: newUser
    }


  }
}
