import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: AuthRequest = {
    email: '',
    password: ''
  };
  
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('✅ Login successful!');
        console.log('Response:', response);
        
        // Attendre un peu que le token soit bien enregistré
        setTimeout(() => {
          const role = this.authService.getUserRole();
          console.log('👤 User role:', role);
          console.log('🔍 Is Doctor?', this.authService.isDoctor());
          console.log('🔍 Is Admin?', this.authService.isAdmin());
          console.log('🔍 Is Patient?', this.authService.isPatient());
          console.log('🔍 Is Secretary?', this.authService.isSecretary());
          
          this.loading = false;
          
          if (role) {
            const path = `/${role.toLowerCase()}`;
            console.log('🚀 Navigating to:', path);
            this.router.navigate([path]).then(success => {
              console.log('Navigation result:', success);
              if (!success) {
                console.error('❌ Navigation failed!');
              }
            });
          } else {
            console.error('❌ No role found!');
            this.errorMessage = 'Erreur: Rôle non trouvé dans le token';
            this.router.navigate(['/']);
          }
        }, 100);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Email ou mot de passe invalide';
        console.error('❌ Login error:', error);
      }
    });
  }
}