import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>){}

  async create(createUserDto: CreateUserDto): Promise<User>{
    const user = await this.findByEmail(createUserDto.email)
    if(user){
      throw new Error('User already exists')
    }
    return this.userRepository.save(createUserDto)
  }

  async findByEmail(email: string): Promise<User | null>{
    return await this.userRepository.findOneBy({email})
  }
}
