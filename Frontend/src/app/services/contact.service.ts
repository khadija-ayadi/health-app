import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContactDto, ContactMessage, ContactResponse } from '../models/contact';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  // Envoyer un message de contact (public)
  sendMessage(contact: ContactDto): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiUrl}/send`, contact);
  }

  // Récupérer tous les messages (admin)
  getAllMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.apiUrl}/all`);
  }

  // Récupérer les messages non lus (admin)
  getUnreadMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.apiUrl}/unread`);
  }

  // Compter les messages non lus (admin)
  countUnreadMessages(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread/count`);
  }

  // Marquer comme lu (admin)
  markAsRead(id: number): Observable<ContactMessage> {
    return this.http.put<ContactMessage>(`${this.apiUrl}/${id}/read`, {});
  }

  // Supprimer un message (admin)
  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}