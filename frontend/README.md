# Insurai Frontend - Insurance Management System

React frontend for the Insurance Management System with role-based dashboards and modern UI.

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Features

### Client Features
✅ User registration and login  
✅ Browse and purchase insurance policies  
✅ View and manage purchased policies  
✅ Renew existing policies  
✅ File insurance claims with document upload  
✅ Track claim status  
✅ Update profile and change password  

### Admin Features
✅ Admin dashboard with statistics  
✅ Create and manage insurance policies  
✅ Review and approve/reject claims  
✅ Manage client accounts  
✅ View all system data  

## Application Routes

### Public Routes
- `/login` - User login
- `/signup` - New user registration

### Client Routes (Role: CLIENT)
- `/client` - Client dashboard
- `/client/buy-policy` - Browse and purchase policies
- `/client/my-policies` - View purchased policies
- `/client/claim` - File insurance claim
- `/client/profile` - User profile management

### Admin Routes (Role: ADMIN)
- `/admin` - Admin dashboard
- `/admin/create-policy` - Create new policy
- `/admin/policies` - Manage policies
- `/admin/claims` - Manage claims
- `/admin/clients` - Manage client accounts

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Common/         # Reusable components
│   │   └── Layout/         # Navigation and layout
│   ├── context/
│   │   └── AuthContext.jsx # Authentication state
│   ├── pages/
│   │   ├── Auth/           # Login & Signup
│   │   ├── Client/         # Client pages
│   │   └── Admin/          # Admin pages
│   ├── services/
│   │   ├── api.js          # Axios configuration
│   │   └── index.js        # API service functions
│   ├── styles/             # Global CSS
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── .env
├── index.html
├── package.json
└── vite.config.js
```

## Technology Stack

- React 18
- React Router DOM 6
- Axios for API calls
- Vite for build tooling
- Modern CSS with CSS Variables

## Design Features

✨ Modern glassmorphism design  
✨ Gradient color schemes  
✨ Smooth animations and transitions  
✨ Responsive layout for all devices  
✨ Professional typography (Inter font)  
✨ Role-based navigation  
✨ Loading states and error handling  

## Default Users

### Client Account
- Email: (create via signup page)
- Role: CLIENT (automatic)

### Admin Account
- Email: `admin@insurai.com`
- Password: `admin123`
- Role: ADMIN (manual database setup required)

## Development Notes

- The app uses JWT tokens stored in localStorage
- Automatic token refresh on API calls
- Protected routes with role-based access control
- Form validation on all input forms
- File uploads support for claims and policy documents
- CORS configured for localhost development

## Build Configuration

Vite proxy is configured to forward API requests to the backend:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
