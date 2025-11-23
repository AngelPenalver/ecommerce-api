import { Module } from '@nestjs/common';
import { AuthDeveloperService } from './auth-developer.service';
import { AuthDeveloperController } from './auth-developer.controller';
import { DeveloperModule } from 'src/developer/developer.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants/jwt.constant';

@Module({
  imports: [DeveloperModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1h' },
  })],
  controllers: [AuthDeveloperController],
  providers: [AuthDeveloperService],
})
export class AuthDeveloperModule { }
