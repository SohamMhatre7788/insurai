# Insurai - Insurance Management System

A full-stack insurance management application built with Spring Boot and React.

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Configure `application.properties` with your MySQL and Cloudinary credentials

3. Create MySQL database:
```sql
CREATE DATABASE insurai_db;
```

4. Run the backend:
```bash
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend-angular 
```

2. Install dependencies:
```bash
npm install
```

4. Run the frontend-angular:
```bash
npm start
```

Frontend will start on `http://localhost:5173`

## 📋 Features

### For Clients (Companies)
- 🔐 Secure registration and login
- 📝 Browse and purchase insurance policies
- 💼 Manage purchased policies
- 🔄 Renew existing policies
- 📄 File insurance claims with document upload
- 📊 Track claim status
- 👤 Profile management

### For Admins
- 📊 Dashboard with statistics
- ➕ Create and manage insurance policies
- ✅ Approve or reject claims
- 👥 Manage client accounts
- 📁 Upload policy documents

## 🛠️ Technology Stack

### Backend
- Spring Boot 3.2.0
- Spring Security (JWT Authentication)
- Spring Data JPA
- MySQL 8.x
- Cloudinary (File Storage)
- Maven

### Framework: Angular 21.0.0
- Language: TypeScript 5.9.2
-Styling: SCSS with custom design system
- HTTP Client: Angular Common HTTP
- Routing: Angular Router
- Forms: Angular Reactive Forms
- State Management: RxJS 7.8.0
- Build Tool: Angular CLI 21.0.4
- Testing: Vitest 4.0.8

## 📂 Project Structure

```
insurai/
├── backend/              # Spring Boot application
│   ├── src/main/java/
│   │   └── com/insurai/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── repository/
│   │       ├── security/
│   │       └── service/
│   └── pom.xml
│
└── frontend-angular/
├── src/
│   ├── app/
│   │   ├── core/               # Core functionality
│   │   │   ├── guards/         # Route guards (auth, admin)
│   │   │   ├── interceptors/   # HTTP interceptors (auth)
│   │   │   ├── models/         # TypeScript interfaces and models
│   │   │   └── services/       # API and business logic services
│   │   ├── features/           # Feature modules
│   │   │   ├── auth/           # Authentication (login, signup, forgot password)
│   │   │   ├── client/         # Client portal features
│   │   │   └── admin/          # Admin panel features
│   │   ├── shared/             # Shared components
│   │   │   ├── navbar/         # Navigation bar
│   │   │   ├── footer/         # Footer component
│   │   │   └── theme-toggle/   # Dark/light theme toggle
│   │   ├── app.routes.ts       # Application routing configuration
│   │   ├── app.config.ts       # Application configuration
│   │   └── app.component.ts    # Root component
│   ├── styles/                 # Global styles
│   └── index.html              # Main HTML file
├── public/                     # Static assets
├── angular.json                # Angular CLI configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```

## 🔑 Default Admin Credentials

To create an admin user, run this SQL query:

```sql
INSERT INTO users (first_name, last_name, email, password_hash, role, created_at, updated_at)
VALUES ('Admin', 'User', 'admin@insurai.com', 
'$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GykIJZLIZJui', 
'ADMIN', NOW(), NOW());
```

- **Email**: `admin@insurai.com`
- **Password**: `admin123`

## 📸 Key Workflows

### Client Workflow
1. Sign up as a new user (automatically gets CLIENT role)
2. Browse available insurance policies
3. Purchase a policy by providing company details
4. File claims against active policies
5. Track claim approval status

### Admin Workflow
1. Login with admin credentials
2. Create new insurance policies
3. Review pending claims
4. Approve or reject claims with reasons
5. Manage client accounts

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (CLIENT/ADMIN)
- Password hashing with BCrypt
- Protected API endpoints
- Secure file uploads to Cloudinary

## 📦 Business Logic

- **Auto-Approval**: LOW risk policies automatically approve claims within coverage
- **Premium Calculation**: `Premium = Premium/Year × Period in Years`
- **Policy Renewal**: Automatically extends end date and recalculates premium
- **Email Notifications**: Console-logged notifications for claims (can be upgraded to real SMTP)

## 🎨 UI Features

- Modern glassmorphism design
- Responsive layout
- Smooth animations
- Professional color palette
- Loading states and error handling

## 📝 API Documentation

Detailed API documentation is available in:
- `backend/README.md` - Complete API endpoint reference
- `frontend/README.md` - Frontend routing and components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is created for educational purposes.

## ⚙️ Configuration Requirements

### Backend Configuration
- MySQL database connection
- Cloudinary credentials (cloud name, API key, API secret)
- JWT secret key

### Frontend Configuration
- Backend API URL

## 🐛 Troubleshooting

### Backend Issues
- Ensure MySQL is running and database exists
- Check Cloudinary credentials in `application.properties`
- Verify Java 17+ is installed

### Frontend Issues
- Run `npm install` if dependencies are missing
- Check `.env` file has correct API URL
- Ensure backend is running on port 8080

## 📬 Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ using Spring Boot and Angular 
