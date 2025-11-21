import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

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
    AuthModule,
    ProductsModule,
    CategoriesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }