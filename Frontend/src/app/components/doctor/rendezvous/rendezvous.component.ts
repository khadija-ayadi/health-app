import { Component, OnInit } from '@angular/core';
import { RendezvousService } from '../../../services/rendezvous.service';
import { SecretaryService } from '../../../services/secretary.service';
import { RendezVous } from '../../../models/rendezvous.model';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';  // ← AJOUTER CETTE LIGNE

@Component({
  selector: 'app-doctor-rendezvous',
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class DoctorRendezvousComponent implements OnInit {
  rendezVousList: RendezVous[] = [];
  filteredRendezVous: RendezVous[] = [];
  loading = false;
  doctorId: number = 0;
  isSecretary = false;
  
  // Filtres
  filterStatus: 'all' | 'accepted' | 'pending' = 'all';
  filterDate: 'all' | 'today' | 'week' | 'month' = 'all';

  constructor(
    private rendezvousService: RendezvousService,
    private secretaryService: SecretaryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      console.error('❌ Impossible de récupérer l\'ID de l\'utilisateur depuis le token');
      Swal.fire({
        icon: 'error',
        title: 'Erreur d\'authentification',
        text: 'Veuillez vous reconnecter.',
        confirmButtonColor: '#667eea'
      });
      return;
    }
    
    this.isSecretary = this.authService.isSecretary();
    
    if (this.isSecretary) {
      const doctorIdFromToken = this.authService.getDoctorIdFromToken();
      
      if (doctorIdFromToken) {
        this.doctorId = doctorIdFromToken;
        console.log('✅ Doctor ID récupéré depuis le JWT (secrétaire):', this.doctorId);
        this.loadRendezVous();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Aucun docteur assigné à cette secrétaire',
          confirmButtonColor: '#667eea'
        });
      }
    } else {
      this.doctorId = userId;
      console.log('✅ Doctor ID récupéré depuis le token (doctor):', this.doctorId);
      this.loadRendezVous();
    }
  }

  loadRendezVous(): void {
    this.loading = true;

    console.log('Chargement des rendez-vous pour le docteur:', this.doctorId);

    this.rendezvousService.getRendezVousByDoctor(this.doctorId).subscribe({
      next: (data) => {
        console.log('✅ Rendez-vous chargés:', data);
        this.rendezVousList = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('❌ Error:', error);
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur de chargement',
          text: 'Impossible de charger les rendez-vous',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.rendezVousList];

    // Filtre par statut
    if (this.filterStatus === 'accepted') {
      filtered = filtered.filter(rdv => rdv.accepted);
    } else if (this.filterStatus === 'pending') {
      filtered = filtered.filter(rdv => !rdv.accepted);
    }

    // Filtre par date
    const now = new Date();
    if (this.filterDate === 'today') {
      const today = now.toISOString().split('T')[0];
      filtered = filtered.filter(rdv => {
        const rdvDate = new Date(rdv.dateRendezVous).toISOString().split('T')[0];
        return rdvDate === today;
      });
    } else if (this.filterDate === 'week') {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(rdv => {
        const rdvDate = new Date(rdv.dateRendezVous);
        return rdvDate >= now && rdvDate <= weekFromNow;
      });
    } else if (this.filterDate === 'month') {
      const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(rdv => {
        const rdvDate = new Date(rdv.dateRendezVous);
        return rdvDate >= now && rdvDate <= monthFromNow;
      });
    }

    this.filteredRendezVous = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  getStatusBadgeClass(rdv: RendezVous): string {
    return rdv.accepted ? 'badge-success' : 'badge-warning';
  }

  getStatusText(rdv: RendezVous): string {
    return rdv.accepted ? 'Accepté' : 'En attente';
  }

  // Méthodes pour les secrétaires
  accepterRendezVous(id: number): void {
    Swal.fire({
      title: 'Accepter ce rendez-vous ?',
      text: 'Le patient sera notifié de la confirmation',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#48bb78',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Oui, accepter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.secretaryService.accepterRendezVous(id).subscribe({
          next: (updatedRdv) => {
            Swal.fire({
              icon: 'success',
              title: 'Rendez-vous accepté !',
              text: 'Le rendez-vous a été confirmé avec succès',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadRendezVous();
          },
          error: (error) => {
            console.error('Error accepting rendez-vous:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible d\'accepter le rendez-vous',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  annulerRendezVous(id: number): void {
    Swal.fire({
      title: 'Annuler ce rendez-vous ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non, garder'
    }).then((result) => {
      if (result.isConfirmed) {
        this.secretaryService.annulerRendezVous(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Rendez-vous annulé',
              text: 'Le rendez-vous a été supprimé avec succès',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadRendezVous();
          },
          error: (error) => {
            console.error('Error canceling rendez-vous:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible d\'annuler le rendez-vous',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }
}