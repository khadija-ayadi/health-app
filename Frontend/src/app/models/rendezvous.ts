import { Patient, Doctor, Speciality } from './user.model';

export interface RendezVous {
  id?: number;
  patient?: Patient;
  doctor?: Doctor;
  dateRendezVous: string;
  speciality: Speciality;
  notes?: string;
  accepted: boolean;
  dateDeNaissance?: string;
  numeroSecuriteSociale?: string;
}

export interface RendezVousDto {
  dateRendezVous?: string;
  speciality?: Speciality;
  notes?: string;
  accepted?: boolean;
  dateDeNaissance?: string;
  numeroSecuriteSociale?: string;
}