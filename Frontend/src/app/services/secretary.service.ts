import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RendezVous } from '../models/rendezvous.model';

@Injectable({
  providedIn: 'root'
})
export class SecretaryService {
  private apiUrl = `${environment.apiUrl}/secritaire`;

  constructor(private http: HttpClient) {}

  /**
   * Accepter un rendez-vous
   * PUT /api/secritaire/rendezvous/{idRendezVouz}/accepter
   */
  accepterRendezVous(idRendezVous: number): Observable<RendezVous> {
    return this.http.put<RendezVous>(`${this.apiUrl}/rendezvous/${idRendezVous}/accepter`, {});
  }

  /**
   * Annuler un rendez-vous
   * DELETE /api/secritaire/rendezvous/{idRendezVouz}/annuler
   */
  annulerRendezVous(idRendezVous: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rendezvous/${idRendezVous}/annuler`);
  }

  /**
   * Créer une fiche patient
   * POST /api/secritaire/fiche/{idPatient}/{idDoctor}
   */
  createFichePatient(idPatient: number, idDoctor: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/fiche/${idPatient}/${idDoctor}`, {});
  }
}