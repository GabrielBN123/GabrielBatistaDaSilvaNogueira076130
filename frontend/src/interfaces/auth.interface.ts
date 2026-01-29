export interface User {
    id: number;
    name: string;
    username: string;
    groups?: string[];
}

export interface JwtPayload {
    userId: number;
    sub: string;
    groups: string[];
    exp: number;
    iss: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
}