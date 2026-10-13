import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { UserDTO } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  patient: UserDTO = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'PATIENT' as any,
    rue: '',
    ville: '',
    codePostal: ''
  };

  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Validation
    if (this.patient.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.patient.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.patientService.registerPatient(this.patient).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! Redirection vers la connexion...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription';
        console.error('Error:', error);
      }
    });
  }
}