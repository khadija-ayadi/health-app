import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { SecretaryService } from '../../../services/secretary.service';

import { AuthService } from '../../../services/auth.service';
import { Patient } from '../../../models/user.model';
import { RendezVous } from '../../../models/rendezvous.model';
import { FichePatient } from '../../../models/fiche-patient.model';

import { forkJoin } from 'rxjs';
import { PdfViewerModalComponent } from '../../pdf-viewer-modal-component/pdf-viewer-modal-component.component';
import { PdfGeneratorService } from 'src/app/services/pdf-generator-service.service';

interface PatientWithDetails extends Patient {
  lastRendezVous?: RendezVous;
}

@Component({
  selector: 'app-doctor-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class DoctorPatientsComponent implements OnInit {
  @ViewChild(PdfViewerModalComponent) pdfModal!: PdfViewerModalComponent;
  
  patients: PatientWithDetails[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  doctorId: number = 0;
  isSecretary = false;

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private secretaryService: SecretaryService,
    private pdfGeneratorService: PdfGeneratorService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      console.error('❌ Impossible de récupérer l\'ID de l\'utilisateur');
      this.errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
      return;
    }
    
    this.isSecretary = this.authService.isSecretary();
    
    if (this.isSecretary) {
      const doctorIdFromToken = this.authService.getDoctorIdFromToken();
      
      if (doctorIdFromToken) {
        this.doctorId = doctorIdFromToken;
        console.log('✅ Doctor ID récupéré depuis le JWT:', this.doctorId);
        this.loadPatients();
      } else {
        this.errorMessage = 'Aucun docteur assigné à cette secrétaire';
        console.error('❌ Secrétaire sans docteur assigné dans le token');
      }
    } else {
      this.doctorId = userId;
      console.log('✅ Doctor ID:', this.doctorId);
      this.loadPatients();
    }
  }

  loadPatients(): void {
    this.loading = true;
    this.errorMessage = '';

    this.patientService.findAllPatients(this.doctorId).subscribe({
      next: (patients) => {
        if (patients.length === 0) {
          this.patients = [];
          this.loading = false;
          return;
        }

        const patientDetailsRequests = patients.map(patient => 
          this.patientService.getPatientRendezVous(patient.id!)
        );

        forkJoin(patientDetailsRequests).subscribe({
          next: (allRendezVous) => {
            this.patients = patients.map((patient, index) => {
              const patientRendezVous = allRendezVous[index];
              const lastRendezVous = patientRendezVous.length > 0 
                ? patientRendezVous[patientRendezVous.length - 1] 
                : undefined;

              return {
                ...patient,
                dateDeNaissance: lastRendezVous?.dateDeNaissance || patient.dateDeNaissance || 'N/A',
                numeroSecuriteSociale: lastRendezVous?.numeroSecuriteSociale || patient.numeroSecuriteSociale || 'N/A',
                lastRendezVous: lastRendezVous
              };
            });

            this.loading = false;
          },
          error: (error) => {
            console.error('❌ Erreur:', error);
            this.patients = patients;
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des patients';
        this.loading = false;
      }
    });
  }

  voirDossier(patient: PatientWithDetails): void {
    this.loading = true;
    
    this.secretaryService.createFichePatient(patient.id!, this.doctorId).subscribe({
      next: (fiche: FichePatient) => {
        const pdfBlob = this.pdfGeneratorService.generateFichePatientPDF(fiche);
        this.pdfModal.openPdf(pdfBlob);
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur:', error);
        this.errorMessage = 'Erreur lors de la génération de la fiche patient';
        this.loading = false;
      }
    });
  }
}