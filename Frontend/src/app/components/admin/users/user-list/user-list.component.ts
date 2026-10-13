import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Filtre
  filterRole: string = 'all';
  searchTerm = '';

  // Pour afficher les rôles
  UserRole = UserRole;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.loading = false;
        console.log('✅ Users loaded:', users.length);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
        console.error('❌ Error:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Filtre par rôle
    if (this.filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === this.filterRole);
    }

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  createUser(): void {
    this.router.navigate(['/admin/users/create']);
  }

  editUser(userId: number): void {
    this.router.navigate(['/admin/users/edit', userId]);
  }

  deleteUser(user: User): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`)) {
      return;
    }

    this.userService.deleteUser(user.id!).subscribe({
      next: () => {
        this.successMessage = 'Utilisateur supprimé avec succès !';
        this.loadUsers();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la suppression de l\'utilisateur';
        console.error('❌ Error:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'badge-admin';
      case UserRole.DOCTOR:
        return 'badge-doctor';
      case UserRole.SECRETARY:
        return 'badge-secretary';
      case UserRole.PATIENT:
        return 'badge-patient';
      default:
        return 'badge-default';
    }
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrateur';
      case UserRole.DOCTOR:
        return 'Docteur';
      case UserRole.SECRETARY:
        return 'Secrétaire';
      case UserRole.PATIENT:
        return 'Patient';
      default:
        return role;
    }
  }
}