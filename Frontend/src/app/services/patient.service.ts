import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Patient, UserDTO } from '../models/user.model';
import { RendezVous, RendezVousDto } from '../models/rendezvous.model';
import { Speciality } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  /**
   * Enregistrer un nouveau patient
   * POST /api/patients/register
   */
  registerPatient(userDTO: UserDTO): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/register`, userDTO);
  }

  /**
   * Ajouter un rendez-vous pour un patient
   * POST /api/patients/{patientId}/rendezvous
   */
  addRendezVous(
    patientId: number,
    doctorId: number,
    speciality: Speciality,
    rendezVousDto: RendezVousDto
  ): Observable<RendezVous> {
    const params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('speciality', speciality);

    return this.http.post<RendezVous>(
      `${this.apiUrl}/${patientId}/rendezvous`,
      rendezVousDto,
      { params }
    );
  }

  /**
   * Modifier un rendez-vous
   * PUT /api/patients/rendezvous/{rendezVousId}
   */
  updateRendezVous(
    rendezVousId: number,
    rendezVousDto: RendezVousDto,
    newDoctorId?: number,
    newSpeciality?: Speciality
  ): Observable<RendezVous> {
    let params = new HttpParams();
    
    if (newDoctorId) {
      params = params.set('newDoctorId', newDoctorId.toString());
    }
    
    if (newSpeciality) {
      params = params.set('newSpeciality', newSpeciality);
    }

    return this.http.put<RendezVous>(
      `${this.apiUrl}/rendezvous/${rendezVousId}`,
      rendezVousDto,
      { params }
    );
  }

  /**
   * Annuler un rendez-vous
   * DELETE /api/patients/rendezvous/{rendezVousId}
   */
  cancelRendezVous(rendezVousId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rendezvous/${rendezVousId}`);
  }

  /**
   * Obtenir tous les patients d'un docteur
   * GET /api/patients/doctor/{doctorId}
   */
  findAllPatients(doctorId: number): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  /**
   * Obtenir les rendez-vous d'un patient
   * Note: Cette méthode nécessiterait un endpoint supplémentaire dans votre backend
   */
  getPatientRendezVous(patientId: number): Observable<RendezVous[]> {
    // TODO: Ajouter cet endpoint dans le backend
    // GET /api/patients/{patientId}/rendezvous
    return this.http.get<RendezVous[]>(`${this.apiUrl}/${patientId}/rendezvous`);
  }
}