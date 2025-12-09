# Insurai Backend - Insurance Management System

Spring Boot backend for the Insurance Management System with JWT authentication, MySQL database, and Cloudinary integration.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Cloudinary account (for file uploads)

## Setup Instructions

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE insurai_db;
```

The application will automatically create tables on startup using JPA.

### 2. Configuration

Update `src/main/resources/application.properties` with your configuration:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/insurai_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# JWT Configuration
jwt.secret=MyVerySecureJWT SecretKeyForInsuraiApplicationThatShouldBeAtLeast256BitsLong
jwt.expiration=86400000

# Cloudinary Configuration
cloudinary.cloud-name=YOUR_CLOUDINARY_CLOUD_NAME
cloudinary.api-key=YOUR_CLOUDINARY_API_KEY
cloudinary.api-secret=YOUR_CLOUDINARY_API_SECRET
```

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new client
- `POST /api/auth/login` - Login (returns JWT token)

### Client Endpoints (Requires CLIENT role)
- `GET /api/client/me` - Get profile
- `PUT /api/client/me` - Update profile
- `PUT /api/client/me/password` - Change password
- `GET /api/policies` - List all policies
- `POST /api/client-policies` - Buy policy
- `GET /api/client-policies` - Get my policies
- `POST /api/client-policies/{id}/renew` - Renew policy
- `POST /api/claims` - Submit claim (with file upload)
- `GET /api/claims/my` - Get my claims

### Admin Endpoints (Requires ADMIN role)
- `POST /api/admin/policies` - Create policy
- `GET /api/admin/policies` - List all policies
- `PUT /api/admin/policies/{id}` - Update policy
- `DELETE /api/admin/policies/{id}` - Delete policy
- `GET /api/admin/claims` - List all claims (with status filter)
- `PUT /api/admin/claims/{id}/approve` - Approve claim
- `PUT /api/admin/claims/{id}/reject` - Reject claim
- `GET /api/admin/users` - List all clients
- `DELETE /api/admin/users/{id}` - Delete client

## Features

✅ JWT-based authentication with role-based access control  
✅ Password hashing with BCrypt  
✅ File upload to Cloudinary for policy documents and claim files  
✅ Auto-approval logic for LOW risk policy claims  
✅ Email notifications (stubbed with console logging)  
✅ Premium and date calculations for policies  
✅ Global exception handling  
✅ Input validation  

## Creating an Admin User

Since signup creates CLIENT users by default, you need to manually create an admin user in the database:

```sql
INSERT INTO users (first_name, last_name, email, password_hash, role, created_at, updated_at)
VALUES ('Admin', 'User', 'admin@insurai.com', 
'$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GykIJZLIZJui', 
'ADMIN', NOW(), NOW());
```

Password: `admin123` (hashed)

## Project Structure

```
backend/
├── src/main/java/com/insurai/
│   ├── config/          # Security, Cloudinary configs
│   ├── controller/      # REST API controllers
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA entities
│   ├── exception/       # Custom exceptions & handlers
│   ├── repository/      # JPA repositories
│   ├── security/        # JWT utilities
│   └── service/         # Business logic
└── src/main/resources/
    └── application.properties
```

## Technology Stack

- Spring Boot 3.2.0
- Spring Security (JWT)
- Spring Data JPA
- MySQL 8.x
- Cloudinary SDK
- Lombok
- Maven
