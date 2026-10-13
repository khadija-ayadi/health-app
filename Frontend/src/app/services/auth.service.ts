import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthRequest, AuthResponse, DecodedToken } from '../models/auth.model';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  private currentUserSubject = new BehaviorSubject<DecodedToken | null>(this.getDecodedToken());
  
  public token$ = this.tokenSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          this.setToken(response.token);
          const decoded = this.decodeToken(response.token);
          console.log('Decoded token:', decoded);
          this.currentUserSubject.next(decoded);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const decoded = this.decodeToken(token);
    if (!decoded) return false;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      console.log('Raw decoded token:', decoded);
      return decoded as DecodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  // ✅ NOUVELLE MÉTHODE : Récupérer l'ID utilisateur
// ✅ MÉTHODE CORRIGÉE : Récupérer l'ID utilisateur
getCurrentUserId(): number | null {
  const decoded = this.getDecodedToken();
  if (!decoded) {
    console.error('No decoded token available');
    return null;
  }
  
  // ✅ Utiliser la notation entre crochets
  const userId = decoded['userId'] || decoded['id'] || decoded.sub;
  
  if (!userId) {
    console.error('No userId found in token:', decoded);
    return null;
  }
  
  // Convertir en nombre si c'est une chaîne
  const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
  console.log('✅ User ID extracted from token:', id);
  return id;
}

  getUserRole(): UserRole | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;
    
    // Essayer différentes sources pour le rôle
    let roleString: string | undefined = undefined;
    
    if (decoded.role) {
      roleString = decoded.role as string;
    } else if (decoded.authorities && decoded.authorities.length > 0) {
      roleString = decoded.authorities[0];
    } else if (decoded.scope) {
      roleString = decoded.scope;
    }
    
    if (!roleString) {
      console.error('No role found in token');
      return null;
    }
    
    // Enlever le préfixe ROLE_ si présent
    if (roleString.startsWith('ROLE_')) {
      roleString = roleString.substring(5);
    }
    
    // Convertir SECRETAIRE (backend) en SECRETARY (frontend)
    if (roleString === 'SECRETAIRE') {
      roleString = 'SECRETARY';
    }
    
    console.log('Extracted role:', roleString);
    return roleString as UserRole;
  }

  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isDoctor(): boolean {
    return this.hasRole(UserRole.DOCTOR);
  }

  isSecretary(): boolean {
    return this.hasRole(UserRole.SECRETARY);
  }

  isPatient(): boolean {
    return this.hasRole(UserRole.PATIENT);
  }

getDoctorIdFromToken(): number | null {
  const decoded = this.getDecodedToken();
  if (!decoded) return null;
  
  console.log('Token decoded for doctorId:', decoded);
  return decoded['doctorId'] || null;
}
}