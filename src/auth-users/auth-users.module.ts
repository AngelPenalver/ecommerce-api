import { Module } from '@nestjs/common';
import { AuthService } from './auth-users.service';
import { AuthController } from './auth-users.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../utils/constants/jwt.constant';

@Module({
  imports: [UserModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret_user,
    signOptions: { expiresIn: '1h' },
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthUsersModule { }
