export interface ContactDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactDto {
  id?: number;
  createdAt?: string;
  isRead?: boolean;
}

export interface ContactResponse {
  message: string;
  id?: number;
}