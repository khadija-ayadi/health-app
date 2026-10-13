import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  totalRendezVous = 0;
  rendezVousPending = 0;
  rendezVousAccepted = 0;
  loading = true;
  errorMessage = '';
  patientId: number = 0;

  constructor(
    private authService: AuthService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    // ⭐ Récupérer l'ID du patient depuis le token JWT
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      console.error('❌ Impossible de récupérer l\'ID du patient depuis le token');
      this.errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
      this.loading = false;
      return;
    }
    
    this.patientId = userId;
    console.log('✅ Patient ID récupéré depuis le token:', this.patientId);
    
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = '';

    console.log('Chargement du dashboard pour le patient:', this.patientId);

    this.patientService.getPatientRendezVous(this.patientId).subscribe({
      next: (rdvs) => {
        this.totalRendezVous = rdvs.length;
        this.rendezVousPending = rdvs.filter(rdv => !rdv.accepted).length;
        this.rendezVousAccepted = rdvs.filter(rdv => rdv.accepted).length;
        
        console.log('✅ Dashboard patient chargé:', {
          total: this.totalRendezVous,
          pending: this.rendezVousPending,
          accepted: this.rendezVousAccepted
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading rendez-vous:', error);
        this.errorMessage = 'Erreur lors du chargement de vos rendez-vous';
        this.loading = false;
      }
    });
  }
}