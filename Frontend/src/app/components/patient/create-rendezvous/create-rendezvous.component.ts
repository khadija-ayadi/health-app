import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service'; // ✅ Importer AuthService
import { RendezVousDto } from '../../../models/rendezvous.model';
import { Speciality, Doctor, SpecialityLabels } from '../../../models/user.model';

@Component({
  selector: 'app-create-rendezvous',
  templateUrl: './create-rendezvous.component.html',
  styleUrls: ['./create-rendezvous.component.css']
})
export class CreateRendezvousComponent implements OnInit {
  rendezVous: RendezVousDto = {
    dateRendezVous: '',
    dateDeNaissance: '',
    numeroSecuriteSociale: '',
    notes: ''
  };

  selectedSpeciality: Speciality | null = null;
  selectedDoctorId: number | null = null;

  specialities = Object.values(Speciality);
  doctors: Doctor[] = [];
  availableDoctors: Doctor[] = [];

  loading = false;
  errorMessage = '';
  patientId: number = 0;

  isEditMode = false;
  rendezVousId: number | null = null;

  constructor(
    private patientService: PatientService,
    private userService: UserService,
    private authService: AuthService, // ✅ Injecter AuthService
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // ✅ RÉCUPÉRER L'ID DEPUIS LE TOKEN
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      console.error('❌ Impossible de récupérer l\'ID du patient depuis le token');
      this.errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
      this.router.navigate(['/login']);
      return;
    }
    
    this.patientId = userId;
    console.log('✅ Patient ID récupéré depuis le token:', this.patientId);

    // Charger le rendez-vous en mode édition
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.rendezVousId = +params['id'];
        this.loadRendezVous();
      }
    });

    this.loadDoctors();
  }

  loadDoctors(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.doctors = users.filter(u => u.role === 'DOCTOR') as Doctor[];
        console.log('Doctors loaded:', this.doctors);
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
      }
    });
  }

  loadRendezVous(): void {
    console.log('Load rendez-vous:', this.rendezVousId);
    // TODO: Implémenter le chargement du rendez-vous existant
  }

  onSpecialityChange(): void {
    if (this.selectedSpeciality) {
      console.log('Filtering doctors for specialty:', this.selectedSpeciality);
      this.availableDoctors = this.doctors.filter(d => {
        console.log(`Doctor ${d.id}: ${d.firstName} ${d.lastName} - Specialty: ${d.specialty}`);
        return d.specialty === this.selectedSpeciality;
      });
      console.log('Available doctors:', this.availableDoctors);

      if (this.selectedDoctorId) {
        const doctorStillAvailable = this.availableDoctors.find(
          d => d.id === this.selectedDoctorId
        );
        if (!doctorStillAvailable) {
          this.selectedDoctorId = null;
        }
      }
    } else {
      this.availableDoctors = [];
      this.selectedDoctorId = null;
    }
  }

  getMinDate(): string {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  }

  getSpecialityLabel(speciality: Speciality): string {
    return SpecialityLabels[speciality] || speciality;
  }

  onSubmit(): void {
    if (!this.selectedSpeciality || !this.selectedDoctorId) {
      this.errorMessage = 'Veuillez sélectionner une spécialité et un docteur';
      return;
    }

    if (!this.rendezVous.dateRendezVous) {
      this.errorMessage = 'Veuillez sélectionner une date et heure pour le rendez-vous';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.rendezVousId) {
      this.updateRendezVous();
    } else {
      this.createRendezVous();
    }
  }

  createRendezVous(): void {
    console.log('=== AVANT CREATION ===');
    console.log('this.rendezVous:', JSON.stringify(this.rendezVous, null, 2));
    console.log('Patient ID:', this.patientId); // ✅ Vérifier l'ID
    
    if (!this.selectedSpeciality || !this.selectedDoctorId) {
      this.errorMessage = 'Erreur: spécialité ou docteur manquant';
      this.loading = false;
      return;
    }

    // ✅ Vérifier que l'ID patient est valide
    if (!this.patientId || this.patientId === 0) {
      this.errorMessage = 'Erreur: ID patient invalide. Veuillez vous reconnecter.';
      this.loading = false;
      return;
    }

    const selectedDoctor = this.availableDoctors.find(d => d.id === this.selectedDoctorId);
    console.log('Doctor sélectionné:', selectedDoctor);
    console.log('Spécialité demandée:', this.selectedSpeciality);

    // Format dates properly for Java LocalDateTime and LocalDate
    let formattedDateRendezVous = this.rendezVous.dateRendezVous;
    if (formattedDateRendezVous && formattedDateRendezVous.length === 16) {
      formattedDateRendezVous += ':00';
    }

    const dto = {
      dateRendezVous: formattedDateRendezVous,
      dateDeNaissance: this.rendezVous.dateDeNaissance,
      numeroSecuriteSociale: this.rendezVous.numeroSecuriteSociale,
      notes: this.rendezVous.notes || ''
    };

    console.log('=== DTO A ENVOYER ===');
    console.log('DTO:', JSON.stringify(dto, null, 2));

    this.patientService.addRendezVous(
      this.patientId,
      this.selectedDoctorId,
      this.selectedSpeciality,
      dto
    ).subscribe({
      next: (response) => {
        console.log('Success response:', response);
        this.loading = false;
        alert('Rendez-vous créé avec succès ! En attente de validation.');
        this.router.navigate(['/patient/rendezvous']);
      },
      error: (error) => {
        this.loading = false;
        console.error('=== ERROR COMPLETE ===');
        console.error('Error object:', error);
        console.error('Error status:', error.status);
        console.error('Error body:', error.error);
        
        this.errorMessage = 'Erreur lors de la création du rendez-vous: ' + 
          (error.error?.message || error.statusText || 'Erreur inconnue');
      }
    });
  }

  updateRendezVous(): void {
    if (!this.selectedSpeciality || !this.selectedDoctorId) {
      this.errorMessage = 'Erreur: spécialité ou docteur manquant';
      this.loading = false;
      return;
    }

    // Format dates for update too
    let formattedDateRendezVous = this.rendezVous.dateRendezVous;
    if (formattedDateRendezVous && formattedDateRendezVous.length === 16) {
      formattedDateRendezVous += ':00';
    }

    const dto = {
      dateRendezVous: formattedDateRendezVous,
      dateDeNaissance: this.rendezVous.dateDeNaissance,
      numeroSecuriteSociale: this.rendezVous.numeroSecuriteSociale,
      notes: this.rendezVous.notes || ''
    };

    this.patientService.updateRendezVous(
      this.rendezVousId!,
      dto,
      this.selectedDoctorId,
      this.selectedSpeciality
    ).subscribe({
      next: () => {
        this.loading = false;
        alert('Rendez-vous modifié avec succès !');
        this.router.navigate(['/patient/rendezvous']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error:', error);
        this.errorMessage = 'Erreur lors de la modification du rendez-vous: ' + 
          (error.error?.message || error.message);
      }
    });
  }
}
