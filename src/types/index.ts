export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterPayload extends LoginCredentials {
    nombrecompleto: string;
    telefono: string;
}

export interface AuthResponse {
    id?: number;
    email: string;
    token?: string;
}