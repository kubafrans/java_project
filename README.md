# Warehouse Management System - Microservices Architecture

A complete Spring Boot-based microservice architecture for warehouse management with JWT authentication, PostgreSQL databases, and NGINX reverse proxy.

## 🏗️ Architecture Overview

The system consists of 4 microservices:

- **Items Service** (Port 8081) - Inventory management
- **Orders Service** (Port 8082) - Order processing
- **Users Service** (Port 8083) - User management
- **Auth Service** (Port 8084) - Authentication & JWT handling

All services are accessible through NGINX reverse proxy on port 8080.

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Java 17+ (for local development)
- Maven 3.8+ (for local development)

### Running the System

```bash
# Clone and navigate to project directory
cd s:\Studia\Rok_03\Semestr_6\Projekty\Zaliczenie_Java

# Start all services
docker-compose up --build

# Services will be available at:
# http://localhost:8080/api/items/
# http://localhost:8080/api/orders/
# http://localhost:8080/api/users/
# http://localhost:8080/api/auth/
```

### Stopping the System

```bash
docker-compose down
```

## 📋 API Documentation

### 🔐 Auth Service (/api/auth/)

Authentication service that handles JWT token generation and user registration/login.

#### Endpoints

**POST /api/auth/register**

- **Description**: Register a new user
- **Request Body**:

```json
{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com",
  "role": "USER"
}
```

- **Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "role": "USER"
}
```

**POST /api/auth/login**

- **Description**: Authenticate user and get JWT token
- **Request Body**:

```json
{
  "username": "john_doe",
  "password": "password123"
}
```

- **Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "role": "USER"
}
```

**POST /api/auth/validate**

- **Description**: Validate JWT token
- **Request Body**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe"
}
```

- **Response**: `true` or `false`

### 👥 Users Service (/api/users/)

User management service with CRUD operations for user profiles.

#### Endpoints

**GET /api/users/**

- **Description**: Get all users
- **Response**:

```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER",
    "password": "[ENCRYPTED]"
  }
]
```

**GET /api/users/{id}**

- **Description**: Get user by ID
- **Response**: User object or 404 if not found

**GET /api/users/username/{username}**

- **Description**: Get user by username
- **Response**: User object or 404 if not found

**POST /api/users/**

- **Description**: Create new user
- **Request Body**:

```json
{
  "username": "jane_doe",
  "password": "password123",
  "email": "jane@example.com",
  "role": "ADMIN"
}
```

**PUT /api/users/{id}**

- **Description**: Update user
- **Request Body**: User object with updated fields

**DELETE /api/users/{id}**

- **Description**: Delete user
- **Response**: 200 OK or 404 if not found

### 📦 Items Service (/api/items/)

Inventory management service for warehouse items.

#### Endpoints

**GET /api/items/**

- **Description**: Get all items
- **Response**:

```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "Gaming laptop with RTX 4070",
    "quantity": 50,
    "price": 1299.99
  }
]
```

**GET /api/items/{id}**

- **Description**: Get item by ID
- **Response**: Item object or 404 if not found

**POST /api/items/**

- **Description**: Create new item
- **Request Body**:

```json
{
  "name": "Smartphone",
  "description": "Latest model smartphone",
  "quantity": 100,
  "price": 899.99
}
```

**PUT /api/items/{id}**

- **Description**: Update item
- **Request Body**: Item object with updated fields

**DELETE /api/items/{id}**

- **Description**: Delete item
- **Response**: 200 OK or 404 if not found

### 🛒 Orders Service (/api/orders/)

Order management service that communicates with Items service for validation.

#### Endpoints

**GET /api/orders/**

- **Description**: Get all orders
- **Response**:

```json
[
  {
    "id": 1,
    "itemId": 1,
    "quantity": 2,
    "status": "PENDING",
    "orderDate": "2024-01-15T10:30:00",
    "userId": 1
  }
]
```

**GET /api/orders/{id}**

- **Description**: Get order by ID
- **Response**: Order object or 404 if not found

**POST /api/orders/**

- **Description**: Create new order (validates item exists)
- **Request Body**:

```json
{
  "itemId": 1,
  "quantity": 3,
  "userId": 1
}
```

- **Note**: Status is automatically set to "PENDING", orderDate is set to current timestamp

**PUT /api/orders/{id}**

- **Description**: Update order
- **Request Body**:

```json
{
  "status": "COMPLETED",
  "quantity": 2
}
```

**DELETE /api/orders/{id}**

- **Description**: Delete order
- **Response**: 200 OK or 404 if not found

## 🏢 System Architecture

### Service Communication

- **Auth Service** ↔ **Users Service**: REST API calls for user validation
- **Orders Service** ↔ **Items Service**: REST API calls for item validation
- **NGINX** → All services: Reverse proxy routing

### Database Schema

#### Users Database (users_db)

```sql
Table: users
- id (BIGSERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE NOT NULL)
- password (VARCHAR NOT NULL) -- BCrypt encrypted
- email (VARCHAR NOT NULL)
- role (VARCHAR NOT NULL)
```

#### Items Database (items_db)

```sql
Table: items
- id (BIGSERIAL PRIMARY KEY)
- name (VARCHAR NOT NULL)
- description (VARCHAR NOT NULL)
- quantity (INTEGER NOT NULL)
- price (DECIMAL NOT NULL)
```

#### Orders Database (orders_db)

```sql
Table: orders
- id (BIGSERIAL PRIMARY KEY)
- item_id (BIGINT NOT NULL)
- quantity (INTEGER NOT NULL)
- status (VARCHAR NOT NULL)
- order_date (TIMESTAMP NOT NULL)
- user_id (BIGINT NOT NULL)
```

## 🔧 Configuration

### Environment Profiles

- **Local**: Uses localhost database connections
- **Docker**: Uses container service names for database connections

### Security

- **JWT Token**: 24-hour expiration, HS256 algorithm
- **Password Encryption**: BCrypt with default strength
- **CORS**: Not configured (add if needed for frontend)

### Database Configuration

Each service connects to its own PostgreSQL database:

- Items Service: `items-db:5432/items_db`
- Orders Service: `orders-db:5432/orders_db`
- Users Service: `users-db:5432/users_db`

## 🛠️ Development

### Project Structure

```
s:\Studia\Rok_03\Semestr_6\Projekty\Zaliczenie_Java\
├── docker-compose.yml
├── nginx.conf
├── README.md
├── items-service/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/warehouse/items/
│       ├── ItemsServiceApplication.java
│       ├── controller/ItemController.java
│       ├── entity/Item.java
│       └── repository/ItemRepository.java
├── orders-service/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/warehouse/orders/
│       ├── OrdersServiceApplication.java
│       ├── controller/OrderController.java
│       ├── entity/Order.java
│       └── repository/OrderRepository.java
├── users-service/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/warehouse/users/
│       ├── UsersServiceApplication.java
│       ├── controller/UserController.java
│       ├── entity/User.java
│       └── repository/UserRepository.java
└── auth-service/
    ├── Dockerfile
    ├── pom.xml
    └── src/main/java/com/warehouse/auth/
        ├── AuthServiceApplication.java
        ├── controller/AuthController.java
        ├── dto/AuthResponse.java
        ├── dto/LoginRequest.java
        └── util/JwtUtil.java
```

### Running Individual Services Locally

```bash
# Items Service
cd items-service
mvn spring-boot:run

# Orders Service
cd orders-service
mvn spring-boot:run

# Users Service
cd users-service
mvn spring-boot:run

# Auth Service
cd auth-service
mvn spring-boot:run
```

### Building Services

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build items-service
```

## 📝 Example Usage Workflow

### 1. Register a User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "warehouse_admin",
    "password": "admin123",
    "email": "admin@warehouse.com",
    "role": "ADMIN"
  }'
```

### 2. Login and Get Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "warehouse_admin",
    "password": "admin123"
  }'
```

### 3. Create an Item

```bash
curl -X POST http://localhost:8080/api/items/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Warehouse Robot",
    "description": "Automated warehouse robot for inventory management",
    "quantity": 5,
    "price": 25000.00
  }'
```

### 4. Create an Order

```bash
curl -X POST http://localhost:8080/api/orders/ \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 1,
    "quantity": 1,
    "userId": 1
  }'
```

## 🐛 Troubleshooting

### Common Issues

**Services not starting:**

- Check if ports 8080-8084 are available
- Verify Docker is running
- Check logs: `docker-compose logs [service-name]`

**Database connection errors:**

- Wait for database health checks to pass
- Check database credentials in docker-compose.yml

**JWT Token issues:**

- Verify token is included in requests
- Check token expiration (24 hours)
- Validate secret key configuration

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs items-service
docker-compose logs auth-service
```

## 🚀 Deployment Notes

### Production Considerations

1. **Security**: Change default passwords and JWT secret
2. **SSL/TLS**: Configure HTTPS in NGINX
3. **Database**: Use managed PostgreSQL service
4. **Monitoring**: Add health checks and metrics
5. **Scaling**: Configure replicas in docker-compose

### Environment Variables

Consider externalizing configuration:

- Database credentials
- JWT secret key
- Service URLs
- CORS settings

## 📄 License

This project is created for educational purposes as part of university coursework.

---

**Author**: Student Project  
**Course**: Rok_03\Semestr_6\Projekty\Zaliczenie_Java  
**Technology Stack**: Spring Boot, PostgreSQL, Docker, NGINX, JWT
