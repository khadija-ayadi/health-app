import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service'; 
import { RendezVous } from '../../../models/rendezvous.model';

@Component({
  selector: 'app-patient-rendezvous-list',
  templateUrl: './rendezvous-list.component.html',
  styleUrls: ['./rendezvous-list.component.css']
})
export class PatientRendezvousListComponent implements OnInit {
  rendezVousList: RendezVous[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  patientId: number = 0; 

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      console.error('❌ Impossible de récupérer l\'ID du patient depuis le token');
      this.errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
      this.router.navigate(['/login']);
      return;
    }
    
    this.patientId = userId;
    console.log('✅ Patient ID récupéré depuis le token:', this.patientId);
    
    this.loadRendezVous();
  }

  loadRendezVous(): void {
    this.loading = true;
    this.errorMessage = '';

    console.log('Chargement des rendez-vous pour le patient:', this.patientId);

    this.patientService.getPatientRendezVous(this.patientId).subscribe({
      next: (data) => {
        console.log('Rendez-vous chargés:', data);
        this.rendezVousList = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des rendez-vous';
        this.loading = false;
        console.error('❌ Error:', error);
        console.error('Error status:', error.status);
        console.error('Error body:', error.error);
      }
    });
  }

  cancelRendezVous(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      return;
    }

    this.patientService.cancelRendezVous(id).subscribe({
      next: () => {
        this.successMessage = 'Rendez-vous annulé avec succès !';
        this.loadRendezVous();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Erreur lors de l\'annulation du rendez-vous';
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  getStatusBadgeClass(rdv: RendezVous): string {
    return rdv.accepted ? 'badge-success' : 'badge-warning';
  }

  getStatusText(rdv: RendezVous): string {
    return rdv.accepted ? 'Accepté' : 'En attente';
  }

  canCancel(rdv: RendezVous): boolean {
    const rdvDate = new Date(rdv.dateRendezVous);
    const now = new Date();
    const hoursDiff = (rdvDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 24;
  }
}