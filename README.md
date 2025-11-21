# ecommerce-api

REST API for an e‑commerce platform built with **NestJS**, **TypeORM**, and **PostgreSQL**. It includes JWT authentication, user management, products and categories, validations with `class-validator`, and a standard response wrapper for all endpoints.

## Tech stack

- **Node.js** + **NestJS 11**
- **TypeORM** + **PostgreSQL**
- **JWT** for authentication
- **class-validator / ValidationPipe** for input validation

## Project structure

```text
src/
  app.module.ts          # Root module, registers TypeORM, Config, and domain modules
  main.ts                # Nest bootstrap, global prefix /api/v1 and ValidationPipe

  auth/
    auth.controller.ts   # Register and login endpoints
    auth.service.ts      # Authentication logic and JWT generation
    constants/           # JWT constants and config
    dto/                 # Login and register DTOs

  user/
    user.module.ts       # User module, exports UserService
    user.controller.ts   # Controller (no public endpoints yet)
    user.service.ts      # User creation and lookup by email
    dto/create-user.dto.ts
    entities/user.entity.ts

  products/
    products.module.ts   # Products module, imports CategoriesModule
    products.controller.ts
    products.service.ts
    dto/                 # Product create/update DTOs
    entities/product.entity.ts

  categories/
    categories.module.ts
    categories.controller.ts
    categories.service.ts
    dto/                 # Category create/update DTOs
    entities/category.entity.ts

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
JWT_SECRET='Here you can put your secret key'
PORT='Here you can put your port'
DATABASE_HOST='Here you can put your database host'
DATABASE_PORT='Here you can put your database port'
DATABASE_USERNAME='Here you can put your database username'
DATABASE_PASSWORD='Here you can put your database password'
DATABASE_NAME='Here you can put your database name'
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
- `password: string` (hashed with bcrypt)
- `role: string` (e.g. `USER`)

### Product

- `id: number`
- `name: string`
- `description: string`
- `price: number`
- `stock: number`
- `isActived: boolean`
- `categories: Category[]` (ManyToMany relation via `product_category` table)
- `createdAt`, `updatedAt`, `deletedAt`

### Category

- `id: number`
- `name: string` (unique)
- `createdAt`, `updatedAt`, `deletedAt`

## Main DTOs

### Auth

- `RegisterAuthDto`:
  - `name: string`
  - `email: string`
  - `password: string`

- `CreateUserDto` (used internally by AuthService when registering):
  - `name: string`
  - `email: string`
  - `password: string`
  - `role: Role` (`ADMIN` | `USER`)

- `Role` enum:
  - `ADMIN`
  - `USER`

- `LoginAuthDto`:
  - `email: string`
  - `password: string`

### Products

- `CreateProductDto`:
  - `name: string`
  - `description: string`
  - `price: number`
  - `stock: number`
  - `categories: number[]` (ids of existing categories)
  - `isActived?: boolean`

- `UpdateProductDto`:
  - Optional product fields (including `categories?: number[]`)

### Categories

- `CreateCategoryDto`:
  - `name: string`

- `UpdateCategoryDto`:
  - `name?: string`

## Response format

All main controllers return `ApiResponseDto<T>`:

```ts
export class ApiResponseDto<T> {
  message: string;
  status: number;
  data?: T;
}
```

## Endpoints

**Base URL:** `http://localhost:{PORT}/api/v1`

### Auth

**POST /auth/register**

- **Body**:
  - `name: string`
  - `email: string`
  - `password: string`
- **Response** (`ApiResponseDto<{ token: string }>`):
  - `message`: `User created successfully`
  - `status`: `201`
  - `data.token`: access JWT

**POST /auth/login**

- **Body**:
  - `email: string`
  - `password: string`
- **Response** (`ApiResponseDto<{ token: string }>`):
  - `message`: `User logged in successfully`
  - `status`: `200`
  - `data.token`: access JWT

> Note: at the moment there are no guards applied on the controllers, so the endpoints are exposed without extra protection. This can be extended later by adding JWT guards.

### Products

**POST /products**

- **Body** (`CreateProductDto`):
  - `name: string`
  - `description: string`
  - `price: number`
  - `stock: number`
  - `categories: number[]` (ids of existing categories)
  - `isActived?: boolean`
- **Behavior**:
  - Validates that all category ids exist with `CategoriesService.validateCategoriesExist`.
  - Creates the product and associates the categories.
- **Response** (`ApiResponseDto<Product>`)

**GET /products**

- **Response** (`ApiResponseDto<Product[]>`):
  - List of products with `categories` eagerly loaded (`relations: ['categories']`).

**GET /products/:id**

- **Params**:
  - `id: number`
- **Response** (`ApiResponseDto<Product>`):
  - Product with its `categories` loaded.
  - `404` if it does not exist (`NotFoundException`).

**PUT /products/:id**

- **Params**:
  - `id: number`
- **Body** (`UpdateProductDto`):
  - Fields to update; if `categories` is provided, ids are validated and re‑assigned.
- **Behavior**:
  - Uses TypeORM `preload` to load the product and apply changes.
  - Throws `NotFoundException` if the product does not exist.
- **Response** (`ApiResponseDto<Product>`)

**DELETE /products/:id**

- **Params**:
  - `id: number`
- **Behavior**:
  - `softDelete` of the product.
  - Throws `NotFoundException` if it does not exist.
- **Response** (`ApiResponseDto<void>`)

### Categories

**POST /categories**

- **Body** (`CreateCategoryDto`):
  - `name: string`
- **Response** (`ApiResponseDto<Category>`):
  - `message`: `Category created successfully`

**GET /categories**

- **Response** (`ApiResponseDto<Category[]>`):
  - List of categories (service is ready to include related products when the entity defines them).

**GET /categories/:id**

- **Params**:
  - `id: number`
- **Response** (`ApiResponseDto<Category>`):
  - Category found or `404` if it does not exist.

**PUT /categories/:id**

- **Params**:
  - `id: number`
- **Body** (`UpdateCategoryDto`):
  - Fields to update (e.g. `name`).
- **Response** (`ApiResponseDto<Category>`)

**DELETE /categories/:id**

- **Params**:
  - `id: number`
- **Behavior**:
  - `softDelete` of the category.
- **Response** (`ApiResponseDto<void>`):
  - `message`: `Category deleted successfully`

### User

Currently `UserController` does not expose additional endpoints besides the auth flows. User creation is handled via `AuthService.register`, which delegates to `UserService`.

## Validation and error handling

- Global `ValidationPipe` with:
  - `whitelist: true` (only allows properties defined in the DTO)
  - `forbidNonWhitelisted: true` (throws if extra properties are sent)
  - `transform: true` (transforms payload types based on DTO metadata)
- Standard NestJS exceptions:
  - `NotFoundException` for missing resources
  - `ConflictException` for duplicate users
  - `UnauthorizedException` for invalid credentials
  - `BadRequestException` for validation errors

## Next steps / possible improvements

- Protect endpoints with JWT guards (roles, auth, etc.).
- Add explicit CRUD endpoints for users.
- Document the API with Swagger (`@nestjs/swagger`).
- Add more unit and e2e tests.

