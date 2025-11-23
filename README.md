# ecommerce-api

REST API for an e‑commerce platform built with **NestJS**, **TypeORM**, and **PostgreSQL**. It includes JWT authentication for both Users and Developers, product and category management, and project tracking.

## Tech stack

- **Node.js** + **NestJS 11**
- **TypeORM** + **PostgreSQL**
- **JWT** for authentication
- **class-validator / ValidationPipe** for input validation

## Project structure

```text
src/
  app.module.ts          # Root module
  main.ts                # Nest bootstrap, global prefix /api/v1

  auth-users/            # Authentication for end-users
    auth-users.controller.ts
    auth-users.service.ts
    dto/

  auth-developer/        # Authentication for developers
    auth-developer.controller.ts
    auth-developer.service.ts
    dto/

  user/                  # User management
    user.module.ts
    user.service.ts
    entities/user.entity.ts

  developer/             # Developer management
    developer.module.ts
    developer.service.ts
    entities/developer.entity.ts

  products/              # Product catalog
    products.controller.ts
    products.service.ts
    entities/product.entity.ts

  categories/            # Product categories
    categories.controller.ts
    categories.service.ts
    entities/category.entity.ts

  project/               # Project management
    project.controller.ts
    project.service.ts
    entities/project.entity.ts

  common/
    dto/api-response.dto.ts # Standard API response wrapper
```

## Setup and installation

### Prerequisites

- Node.js
- Running PostgreSQL instance
- pnpm / npm / yarn (project includes a `pnpm-lock.yaml`)

### Clone and install dependencies

```bash
git clone https://github.com/AngelPenalver/ecommerce-api.git
cd ecommerce-api
pnpm install   # or npm install / yarn install
```

### Environment variables

Based on `.env.example`:

```env
JWT_SECRET_USER='Here you can put your secret key'
JWT_SECRET_DEVELOPER='Here you can put your secret key'
PORT='Here you can put your port'
DATABASE_URL='Here you can put your database url'
STAGE='Here you can put your stage'
```

Create a `.env` file in the project root with values adapted to your environment.

TypeORM is configured in `AppModule` using these variables. `autoLoadEntities: true` and `synchronize: true` are enabled, so entities are synchronized automatically with the database in development.

### Available scripts

```bash
pnpm start       # nest start
pnpm start:dev   # nest start --watch
pnpm build       # nest build
pnpm test        # jest
pnpm lint        # eslint
```

By default the API runs at `http://localhost:${PORT || 3000}/api/v1`.

## Core entities

### User
- `id: number`
- `name: string`
- `email: string`
- `password: string` (hashed)
- `role: string`

### Developer
- `id: number`
- `name: string`
- `email: string`
- `password: string` (hashed)
- `role: string`

### Product
- `id: number`
- `name: string`
- `description: string`
- `price: number`
- `stock: number`
- `isActived: boolean`
- `categories: Category[]`

### Category
- `id: number`
- `name: string`

### Project
- `id: number`
- `name: string`
- `description: string`

## Main DTOs

### Auth Users
- `RegisterAuthDto`: `name`, `email`, `password`
- `LoginAuthDto`: `email`, `password`

### Auth Developer
- `RegisterAuthDeveloperDto`: `name`, `email`, `password`
- `LoginAuthDeveloperDto`: `email`, `password`

### Products
- `CreateProductDto`: `name`, `description`, `price`, `stock`, `categories` (ids), `isActived`
- `UpdateProductDto`: Partial fields

### Categories
- `CreateCategoryDto`: `name`
- `UpdateCategoryDto`: `name`

## Endpoints

**Base URL:** `http://localhost:{PORT}/api/v1`

### Auth Users (`/auth-users`)
- **POST /register**: Register a new user.
- **POST /login**: Login as user.

### Auth Developer (`/auth-developer`)
- **POST /register**: Register a new developer.
- **POST /login**: Login as developer.

### Products (`/products`)
- **POST /**: Create product.
- **GET /**: Get all products.
- **GET /:id**: Get product by ID.
- **PUT /:id**: Update product.
- **DELETE /:id**: Soft delete product.

### Categories (`/categories`)
- **POST /**: Create category.
- **GET /**: Get all categories.
- **GET /:id**: Get category by ID.
- **PUT /:id**: Update category.
- **DELETE /:id**: Soft delete category.

### Developer (`/developer`)
- _Endpoints to be implemented_

### Project (`/project`)
- _Endpoints to be implemented_

## Response format

All main controllers return `ApiResponseDto<T>`:

```ts
export class ApiResponseDto<T> {
  message: string;
  status: number;
  data?: T;
}
```
