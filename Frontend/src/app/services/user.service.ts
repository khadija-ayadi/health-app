import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserDTO, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  createUser(userDto: UserDTO): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, userDto);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/All-Users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUsersByRole(role: UserRole): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/role/${role}`);
  }

  updateUser(id: number, userDto: UserDTO): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${id}`, userDto);
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
  }
}
