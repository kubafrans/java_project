# Warehouse Management Microservices

A complete Spring Boot microservices architecture for warehouse management with Docker Compose, PostgreSQL databases, JWT authentication, NGINX reverse proxy, and centralized Swagger documentation.

## Architecture Overview

This project consists of 5 microservices:

- **Items Service** (Port 8081) - Manages warehouse inventory
- **Orders Service** (Port 8082) - Manages orders and communicates with Items service
- **Users Service** (Port 8083) - Manages user profiles and roles
- **Auth Service** (Port 8084) - Handles authentication and JWT token generation
- **Swagger Gateway** (Port 8085) - Centralized API documentation aggregator

## Tech Stack

- **Framework**: Spring Boot 3.1.0
- **Database**: PostgreSQL 15
- **Authentication**: JWT (JSON Web Tokens)
- **Reverse Proxy**: NGINX
- **Containerization**: Docker & Docker Compose
- **Documentation**: Centralized Swagger/OpenAPI 3 Gateway
- **Build Tool**: Maven

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Java 17+ (for local development)
- Maven 3.6+ (for local development)

### Running with Docker Compose

```bash
# Clone and navigate to project directory
cd s:\Studia\Rok_03\Semestr_6\Projekty\Zaliczenie_Java

# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### Accessing Services

All services are accessible through NGINX reverse proxy on `http://localhost:8080`:

- **Centralized API Documentation**: `http://localhost:8080/swagger-ui/index.html` ⭐ **PRIMARY ACCESS POINT**
- **API Overview**: `http://localhost:8080/` (redirects to Swagger UI)
- **Items API**: `http://localhost:8080/api/items/`
- **Orders API**: `http://localhost:8080/api/orders/`
- **Users API**: `http://localhost:8080/api/users/`
- **Auth API**: `http://localhost:8080/api/auth/`

### 📚 API Documentation

**NEW: Centralized Swagger Gateway**

The project now includes a dedicated Swagger Gateway service that provides unified documentation for all microservices:

#### 🎯 Primary Documentation Access

- **Unified Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
  - Interactive documentation for all services in one place
  - Service selection dropdown for easy navigation
  - Unified API testing interface

#### 📋 API Specifications

- **Combined OpenAPI**: `http://localhost:8080/v3/api-docs`
- **Individual Service Specs**:
  - Items: `http://localhost:8080/items/v3/api-docs`
  - Orders: `http://localhost:8080/orders/v3/api-docs`
  - Users: `http://localhost:8080/users/v3/api-docs`
  - Auth: `http://localhost:8080/auth/v3/api-docs`

#### ✅ Key Benefits of Swagger Gateway

- **Single Entry Point**: One URL for all API documentation
- **Service Discovery**: Automatically aggregates all microservice APIs
- **Consistent Interface**: Unified look and feel across all services
- **Easy Testing**: Test APIs from all services in one interface
- **Development Efficiency**: No need to remember multiple documentation URLs

### Health Check Endpoints

- **NGINX Health**: `http://localhost:8080/health`
- **Swagger Gateway**: `http://localhost:8080/health` (via gateway controller)
- **Individual Services**:
  - Items: `http://localhost:8080/api/items/health`
  - Orders: `http://localhost:8080/api/orders/health`
  - Users: `http://localhost:8080/api/users/health`
  - Auth: `http://localhost:8080/api/auth/health`

### 🚀 Getting Started with API Testing

1. **Start the services**: `docker-compose up --build`
2. **Open Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
3. **Select a service** from the dropdown (Items, Orders, Users, Auth)
4. **Try the APIs** directly from the interface

## API Endpoints

### Auth Service (`/api/auth/`)

| Method | Endpoint    | Description          |
| ------ | ----------- | -------------------- |
| POST   | `/login`    | User login           |
| POST   | `/register` | User registration    |
| POST   | `/validate` | JWT token validation |

### Users Service (`/api/users/`)

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/`                    | Get all users        |
| GET    | `/{id}`                | Get user by ID       |
| GET    | `/username/{username}` | Get user by username |
| POST   | `/`                    | Create new user      |
| PUT    | `/{id}`                | Update user          |
| DELETE | `/{id}`                | Delete user          |

### Items Service (`/api/items/`)

| Method | Endpoint | Description     |
| ------ | -------- | --------------- |
| GET    | `/`      | Get all items   |
| GET    | `/{id}`  | Get item by ID  |
| POST   | `/`      | Create new item |
| PUT    | `/{id}`  | Update item     |
| DELETE | `/{id}`  | Delete item     |

### Orders Service (`/api/orders/`)

| Method | Endpoint | Description                              |
| ------ | -------- | ---------------------------------------- |
| GET    | `/`      | Get all orders                           |
| GET    | `/{id}`  | Get order by ID                          |
| POST   | `/`      | Create new order (validates item exists) |
| PUT    | `/{id}`  | Update order                             |
| DELETE | `/{id}`  | Delete order                             |

## Sample API Usage

### 1. Test service availability

```bash
# Check API overview (redirects to Swagger)
curl http://localhost:8080/

# Check Swagger Gateway health
curl http://localhost:8080/health

# Test individual services
curl http://localhost:8080/api/auth/health
curl http://localhost:8080/api/items/health
```

### 2. Using Swagger UI (Recommended)

1. Open `http://localhost:8080/swagger-ui/index.html`
2. Select "Auth Service" from dropdown
3. Use the `/api/auth/register` endpoint to create a user
4. Use the `/api/auth/login` endpoint to get a JWT token
5. Switch to "Items Service" and create items
6. Switch to "Orders Service" and create orders

### 3. Register a new user (via curl)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123",
    "email": "john@example.com",
    "role": "USER"
  }'
```

### 4. Login and get JWT token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### 5. Create an item

```bash
curl -X POST http://localhost:8080/api/items/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Dell Laptop",
    "quantity": 10,
    "price": 999.99
  }'
```

### 6. Create an order

```bash
curl -X POST http://localhost:8080/api/orders/ \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 1,
    "quantity": 2,
    "userId": 1
  }'
```

## Database Configuration

Each service has its own PostgreSQL database:

- **items-db**: `items_db` database with user `items_user`
- **orders-db**: `orders_db` database with user `orders_user`
- **users-db**: `users_db` database with user `users_user`

Database schemas are automatically created using JPA/Hibernate DDL auto-generation.

## Service Communication

- **Orders Service** → **Items Service**: REST API calls to validate items
- **Auth Service** → **Users Service**: REST API calls for user authentication
- **Swagger Gateway** → **All Services**: Aggregates OpenAPI specifications
- All inter-service communication uses internal Docker network

## Development

### Running Individual Services Locally

Each service can be run independently for development:

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

# Swagger Gateway
cd swagger-gateway
mvn spring-boot:run
```

### Building Services

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build items-service
docker-compose build swagger-gateway
```

## Configuration

### Environment Variables

Services support different profiles:

- `default`: Local development with localhost databases
- `docker`: Docker environment with service discovery

### JWT Configuration

JWT tokens are configured in `auth-service` with:

- Secret key: Configurable via `jwt.secret`
- Expiration: 24 hours (configurable via `jwt.expiration`)

### Swagger Gateway Configuration

The Swagger Gateway service automatically discovers and aggregates all microservice APIs:

- Configured via `application.yml` in swagger-gateway service
- URLs are environment-aware (localhost for dev, internal network for Docker)
- Provides unified interface for all service documentation

## Monitoring and Health Checks

- **Centralized Documentation**: Swagger Gateway at `http://localhost:8080/swagger-ui/index.html`
- **NGINX Health**: `http://localhost:8080/health`
- **Individual Service Health**: Available via `/api/{service}/health` endpoints
- **Docker Health Checks**: PostgreSQL databases include health checks
- **Service Dependencies**: Services start in proper dependency order

## Security

- Passwords are encrypted using BCrypt
- JWT tokens for stateless authentication
- CORS enabled for cross-origin requests
- Input validation on all endpoints

## Troubleshooting

### Common Issues

1. **Swagger Gateway Not Loading**:

   - **Solution**: Ensure all microservices are running and healthy
   - Check service logs: `docker-compose logs swagger-gateway`
   - Verify NGINX routing: `docker-compose logs nginx`
   - Test individual service APIs first

2. **"Failed to load remote configuration" in Swagger**:

   - **Fixed**: Now handled by dedicated Swagger Gateway service
   - If still occurring, wait for all services to start: `docker-compose ps`
   - Check network connectivity between services

3. **Service not responding**:

   - Ensure you're using `http://localhost:8080` (not just `localhost`)
   - Check all containers are running: `docker-compose ps`
   - Verify service health endpoints

4. **Port conflicts**:

   - Ensure port 8080 is available
   - Check if any other services are using ports 8081-8085

5. **Database connection errors**:
   - Wait for PostgreSQL containers to fully start (health checks help)
   - Check database logs: `docker-compose logs items-db`

### Testing Swagger Gateway

```bash
# Test Swagger Gateway service
curl http://localhost:8080/health

# Test OpenAPI aggregation
curl http://localhost:8080/v3/api-docs

# Test individual service specs through gateway
curl http://localhost:8080/items/v3/api-docs
curl http://localhost:8080/orders/v3/api-docs
curl http://localhost:8080/users/v3/api-docs
curl http://localhost:8080/auth/v3/api-docs
```

### Logs

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs swagger-gateway
docker-compose logs items-service
docker-compose logs -f orders-service

# View NGINX logs
docker-compose logs nginx
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Debugging Steps

1. **Check if all containers are running:**

   ```bash
   docker-compose ps
   ```

2. **Test Swagger Gateway:**

   ```bash
   curl http://localhost:8080/swagger-ui/index.html
   curl http://localhost:8080/health
   ```

3. **Check API availability:**

   ```bash
   curl http://localhost:8080/api/items/health
   curl http://localhost:8080/api/orders/health
   ```

4. **Test service connectivity:**

   ```bash
   # Test if services can reach each other
   docker-compose exec orders-service curl http://items-service:8081/api/items/health
   docker-compose exec swagger-gateway curl http://nginx/items/v3/api-docs
   ```

5. **Restart services if needed:**
   ```bash
   docker-compose restart
   # Or restart specific service
   docker-compose restart swagger-gateway
   ```

## Project Structure

```
s:\Studia\Rok_03\Semestr_6\Projekty\Zaliczenie_Java\
├── docker-compose.yml
├── nginx.conf
├── README.md
├── items-service/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/warehouse/items/
├── orders-service/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/warehouse/orders/
├── users-service/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/warehouse/users/
├── auth-service/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/warehouse/auth/
└── swagger-gateway/          ⭐ NEW
    ├── Dockerfile
    ├── pom.xml
    └── src/main/java/com/warehouse/swagger/
```

## 🎯 Key Improvements in This Version

### Centralized Documentation

- **Unified Swagger UI**: Single access point for all API documentation
- **Automatic Service Discovery**: Gateway automatically aggregates all microservice APIs
- **Improved UX**: Better developer experience with centralized documentation
- **Reduced Complexity**: No need to manage multiple Swagger instances

### Enhanced Architecture

- **Dedicated Documentation Service**: Swagger Gateway as independent microservice
- **Better Service Separation**: Documentation concerns separated from business logic
- **Scalable Design**: Easy to add new services to documentation

### Improved Reliability

- **Health Checks**: Comprehensive health monitoring for all services
- **Service Dependencies**: Proper startup ordering with health checks
- **Error Handling**: Better error handling and troubleshooting guidance

## Contributing

1. Create feature branch
2. Add tests for new functionality
3. Update documentation
4. Submit pull request

## License

This project is for educational purposes as part of Java coursework.
