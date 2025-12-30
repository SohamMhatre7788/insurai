# Insurai - Angular Frontend

A modern insurance management platform built with Angular 21, providing comprehensive insurance policy management, claims processing, and AI-powered assistance.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Environment Configuration](#environment-configuration)

## 🎯 Overview

Insurai is a full-featured insurance management system that provides:
- **Client Portal**: Browse policies, submit applications, manage claims, and get AI assistance
- **Admin Dashboard**: Comprehensive policy and user management, claims approval, and analytics
- **Secure Authentication**: JWT-based authentication with role-based access control

## ✨ Features

### Client Features
- 📱 User-friendly dashboard with policy overview
- 🔍 Browse and search available insurance policies
- 📝 Submit and track policy applications
- 💼 File and manage insurance claims
- 👤 Profile management
- 🤖 AI-powered insurance assistant

### Admin Features
- 📊 Comprehensive admin dashboard with analytics
- 🏢 Policy management (create, update, delete)
- 👥 User management and oversight
- ✅ Claims approval and rejection workflow
- 📋 Policy application review
- 🤖 AI-powered administrative assistance

## 🛠 Tech Stack

- **Framework**: Angular 21.0.0
- **Language**: TypeScript 5.9.2
- **Styling**: SCSS with custom design system
- **HTTP Client**: Angular Common HTTP
- **Routing**: Angular Router
- **Forms**: Angular Reactive Forms
- **State Management**: RxJS 7.8.0
- **Build Tool**: Angular CLI 21.0.4
- **Testing**: Vitest 4.0.8

## 📁 Project Structure

```
frontend-angular/
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

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v10 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd insurai/frontend-angular
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create environment configuration files (if not exists):
   - `src/environments/environment.ts` (development)
   - `src/environments/environment.prod.ts` (production)
   
   Configure the backend API URL and other settings.

4. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:4200/`

## 💻 Development

### Development Server

Start the development server:
```bash
ng serve
```

The application will automatically reload when you modify source files.

### Code Scaffolding

Generate new components, services, guards, etc.:

```bash
# Generate a component
ng generate component features/component-name

# Generate a service
ng generate service core/services/service-name

# Generate a guard
ng generate guard core/guards/guard-name

# See all available options
ng generate --help
```

### Code Style

This project uses Prettier for code formatting with the following configuration:
- Print width: 100 characters
- Single quotes
- Angular HTML parser for templates

Format your code:
```bash
npx prettier --write .
```

## 🏗 Building

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory, optimized for performance and speed.

## 🧪 Testing

### Unit Tests

Run unit tests with Vitest:
```bash
ng test
```

### End-to-End Tests

```bash
ng e2e
```

Note: E2E testing framework needs to be configured separately.

## ⚙️ Environment Configuration

Configure your environment variables for different deployment targets:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

## 🔑 Key Services

- **AuthService**: Handles authentication, login, signup, and token management
- **UserService**: Manages user profile and client-specific operations
- **AdminService**: Handles admin-specific operations
- **PolicyService**: Manages insurance policies
- **ClaimService**: Handles claim submissions and management
- **AIService**: Interfaces with AI assistant functionality

## 🛡 Route Guards

- **AuthGuard**: Protects routes requiring authentication
- **AdminGuard**: Restricts access to admin-only routes

## 📝 Additional Resources

- [Angular Documentation](https://angular.dev/)
- [Angular CLI Command Reference](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📄 License

This project is part of the Insurai insurance management system.

## 🤝 Contributing

For contribution guidelines and development workflows, please refer to the main project documentation.
