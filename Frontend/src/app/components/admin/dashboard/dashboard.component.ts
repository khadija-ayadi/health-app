import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { User, UserRole } from '../../../models/user.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  totalDoctors = 0;
  totalSecretaries = 0;
  totalPatients = 0;
  loading = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        this.totalDoctors = users.filter(u => u.role === UserRole.DOCTOR).length;
        this.totalSecretaries = users.filter(u => u.role === UserRole.SECRETARY).length;
        this.totalPatients = users.filter(u => u.role === UserRole.PATIENT).length;
        
        console.log('✅ Dashboard loaded:', {
          total: this.totalUsers,
          doctors: this.totalDoctors,
          secretaries: this.totalSecretaries,
          patients: this.totalPatients
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading dashboard:', error);
        this.errorMessage = 'Erreur lors du chargement des données';
        this.loading = false;
      }
    });
  }
}