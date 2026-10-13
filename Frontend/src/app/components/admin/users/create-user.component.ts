import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserDTO, UserRole, Speciality, Doctor } from '../../../models/user.model';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  user: UserDTO = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: UserRole.DOCTOR,
    rue: '',
    ville: '',
    codePostal: '',
    specialty: undefined,
    doctorId: undefined
  };

  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Listes pour les sélections
  roles = [UserRole.DOCTOR, UserRole.SECRETARY, UserRole.ADMIN];
  specialities = Object.values(Speciality);
  doctors: Doctor[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.doctors = users.filter(u => u.role === UserRole.DOCTOR) as Doctor[];
        console.log('✅ Doctors loaded:', this.doctors.length);
      },
      error: (error) => {
        console.error('❌ Error loading doctors:', error);
      }
    });
  }

  onRoleChange(): void {
    // Réinitialiser les champs spécifiques au rôle
    this.user.specialty = undefined;
    this.user.doctorId = undefined;
    console.log('Role changed to:', this.user.role);
  }

  onSubmit(): void {
    console.log('=== SUBMIT ===');
    console.log('User data:', this.user);
    console.log('Confirm password:', this.confirmPassword);

    // Validation des mots de passe
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.user.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    // Validation rôle Doctor
    if (this.user.role === UserRole.DOCTOR && !this.user.specialty) {
      this.errorMessage = 'La spécialité est obligatoire pour un docteur';
      return;
    }

    // Validation rôle Secretary
    if (this.user.role === UserRole.SECRETARY && !this.user.doctorId) {
      this.errorMessage = 'Veuillez sélectionner un docteur pour la secrétaire';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    console.log('Sending to API:', this.user);

    this.userService.createUser(this.user).subscribe({
      next: (response) => {
        console.log('✅ User created:', response);
        this.successMessage = 'Utilisateur créé avec succès !';
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error creating user:', error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la création de l\'utilisateur';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}