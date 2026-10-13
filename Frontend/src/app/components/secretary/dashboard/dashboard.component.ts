import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { PatientService } from '../../../services/patient.service';
import { RendezvousService } from '../../../services/rendezvous.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-secretary-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class SecretaryDashboardComponent implements OnInit {
  totalPatients = 0;
  totalRendezVous = 0;
  rendezVousPending = 0;
  rendezVousToday = 0;
  loading = true;
  errorMessage = '';
  doctorId: number = 0;

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private rendezvousService: RendezvousService
  ) {}

  ngOnInit(): void {
    // Récupérer le doctorId depuis le token JWT
    const doctorIdFromToken = this.authService.getDoctorIdFromToken();
    
    if (doctorIdFromToken) {
      this.doctorId = doctorIdFromToken;
      console.log('✅ Doctor ID récupéré pour la secrétaire:', this.doctorId);
      this.loadDashboardData();
    } else {
      this.errorMessage = 'Aucun docteur assigné à cette secrétaire';
      console.error('❌ Secrétaire sans docteur assigné');
      this.loading = false;
    }
  }

  loadDashboardData(): void {
    this.loading = true;

    // Charger les patients et rendez-vous en parallèle
    forkJoin({
      patients: this.patientService.findAllPatients(this.doctorId),
      rendezvous: this.rendezvousService.getRendezVousByDoctor(this.doctorId)
    }).subscribe({
      next: (result) => {
        this.totalPatients = result.patients.length;
        this.totalRendezVous = result.rendezvous.length;
        
        // Compter les RDV en attente
        this.rendezVousPending = result.rendezvous.filter(rdv => !rdv.accepted).length;
        
        // Compter les RDV d'aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        this.rendezVousToday = result.rendezvous.filter(rdv => {
          const rdvDate = new Date(rdv.dateRendezVous).toISOString().split('T')[0];
          return rdvDate === today;
        }).length;
        
        console.log('✅ Dashboard secrétaire chargé:', {
          patients: this.totalPatients,
          rendezvous: this.totalRendezVous,
          pending: this.rendezVousPending,
          today: this.rendezVousToday
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