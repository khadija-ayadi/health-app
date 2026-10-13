import { UserRole } from './user.model';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  sub: string; // email
  role?: UserRole | string;
  authorities?: string[];
  scope?: string;
  exp: number;
  iat: number;
  [key: string]: any; 
}