export interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
