import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthUsersModule } from './auth-users/auth-users.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectModule } from './project/project.module';
import { DeveloperModule } from './developer/developer.module';
import { CommonModule } from './common/common.module';
import { AuthDeveloperModule } from './auth-developer/auth-developer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,

      ssl: process.env.STAGE === 'prod' ? {
        rejectUnauthorized: false
      } : false,

    }),
    UserModule,
    AuthUsersModule,
    AuthDeveloperModule,
    ProductsModule,
    CategoriesModule,
    ProjectModule,
    DeveloperModule,
    CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }