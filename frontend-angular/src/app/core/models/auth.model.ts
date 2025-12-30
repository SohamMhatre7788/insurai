export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CLIENT' | 'ADMIN';
}

export interface AuthResponse {
    token: string;
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: 'CLIENT' | 'ADMIN';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
}
