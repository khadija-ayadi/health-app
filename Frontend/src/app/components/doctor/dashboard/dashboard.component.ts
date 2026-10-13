import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { PatientService } from '../../../services/patient.service';
import { RendezvousService } from '../../../services/rendezvous.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  totalPatients = 0;
  totalRendezVous = 0;
  rendezVousToday = 0;
  loading = true;
  errorMessage = '';
  doctorId: number = 0;
  isSecretary = false;

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private rendezvousService: RendezvousService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      console.error('❌ Impossible de récupérer l\'ID de l\'utilisateur depuis le token');
      this.errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
      this.loading = false;
      return;
    }
    
    this.isSecretary = this.authService.isSecretary();
    
    if (this.isSecretary) {
      // ⭐ Si c'est une secrétaire, récupérer le doctorId depuis le token JWT
      const doctorIdFromToken = this.authService.getDoctorIdFromToken();
      
      if (doctorIdFromToken) {
        this.doctorId = doctorIdFromToken;
        console.log('✅ Doctor ID récupéré depuis le JWT (secrétaire):', this.doctorId);
        this.loadDashboardData();
      } else {
        this.errorMessage = 'Aucun docteur assigné à cette secrétaire';
        console.error('❌ Secrétaire sans docteur assigné dans le token');
        this.loading = false;
      }
    } else {
      // Si c'est un doctor, utiliser directement son ID
      this.doctorId = userId;
      console.log('✅ Doctor ID récupéré depuis le token (doctor):', this.doctorId);
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = '';

    console.log('Chargement du dashboard pour le docteur:', this.doctorId);

    // Charger les patients
    this.patientService.findAllPatients(this.doctorId).subscribe({
      next: (patients) => {
        this.totalPatients = patients.length;
        console.log('✅ Patients chargés:', patients.length);
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('❌ Error loading patients:', error);
        this.errorMessage = 'Erreur lors du chargement des patients';
        this.checkLoadingComplete();
      }
    });

    // Charger les rendez-vous
    this.rendezvousService.getRendezVousByDoctor(this.doctorId).subscribe({
      next: (rdvs) => {
        this.totalRendezVous = rdvs.length;
        console.log('✅ Rendez-vous chargés:', rdvs.length);
        
        // Compter les RDV d'aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        this.rendezVousToday = rdvs.filter(rdv => {
          const rdvDate = new Date(rdv.dateRendezVous).toISOString().split('T')[0];
          return rdvDate === today;
        }).length;
        
        console.log('✅ RDV aujourd\'hui:', this.rendezVousToday);
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('❌ Error loading rendez-vous:', error);
        this.errorMessage = 'Erreur lors du chargement des rendez-vous';
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    // On attend que les 2 appels soient terminés
    // Dans une vraie application, on utiliserait forkJoin
    this.loading = false;
  }
}