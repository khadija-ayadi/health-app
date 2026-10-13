export interface Adresse {
  id?: number;
  rue: string;
  ville: string;
  codePostal: string;
}

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  adresse?: Adresse;
   dateDeNaissance?: string;
  numeroSecuriteSociale?: string;
}

export interface Admin extends User {
  role: UserRole.ADMIN;
}

export interface Doctor extends User {
  role: UserRole.DOCTOR;
  specialty: Speciality;
}

export interface Secretary extends User {
  role: UserRole.SECRETARY;
  doctorId?: number;
  doctor?: Doctor;
}

export interface Patient extends User {
  role: UserRole.PATIENT;
  dateDeNaissance?: string;
  numeroSecuriteSociale?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  SECRETARY = 'SECRETARY',  // Frontend utilise SECRETARY
  PATIENT = 'PATIENT'
}

export enum Speciality {
  CARDIOLOGY = 'CARDIOLOGY',
  DERMATOLOGY = 'DERMATOLOGY',
  DIETETICS = 'DIETETICS',
  ENDOCRINOLOGY = 'ENDOCRINOLOGY',
  GASTROENTEROLOGY = 'GASTROENTEROLOGY',
  GERIATRICS = 'GERIATRICS',
  HEMATOLOGY = 'HEMATOLOGY',
  AESTHETIC_MEDICINE = 'AESTHETIC_MEDICINE',
  GENERAL_MEDICINE = 'GENERAL_MEDICINE',
  NEUROLOGY = 'NEUROLOGY',
  NUTRITION = 'NUTRITION',
  ONCOLOGY = 'ONCOLOGY',
  OPHTHALMOLOGY = 'OPHTHALMOLOGY',
  OTOLARYNGOLOGY = 'OTOLARYNGOLOGY',
  PEDIATRICS = 'PEDIATRICS',
  PSYCHIATRY = 'PSYCHIATRY',
  PSYCHOLOGY = 'PSYCHOLOGY'
}

export const SpecialityLabels: { [key in Speciality]: string } = {
  [Speciality.CARDIOLOGY]: 'Cardiologie',
  [Speciality.DERMATOLOGY]: 'Dermatologie',
  [Speciality.DIETETICS]: 'Diététique',
  [Speciality.ENDOCRINOLOGY]: 'Endocrinologie',
  [Speciality.GASTROENTEROLOGY]: 'Gastro-entérologie',
  [Speciality.GERIATRICS]: 'Gériatrie',
  [Speciality.HEMATOLOGY]: 'Hématologie',
  [Speciality.AESTHETIC_MEDICINE]: 'Médecine Esthétique',
  [Speciality.GENERAL_MEDICINE]: 'Médecine Générale',
  [Speciality.NEUROLOGY]: 'Neurologie',
  [Speciality.NUTRITION]: 'Nutrition',
  [Speciality.ONCOLOGY]: 'Oncologie',
  [Speciality.OPHTHALMOLOGY]: 'Ophtalmologie',
  [Speciality.OTOLARYNGOLOGY]: 'ORL',
  [Speciality.PEDIATRICS]: 'Pédiatrie',
  [Speciality.PSYCHIATRY]: 'Psychiatrie',
  [Speciality.PSYCHOLOGY]: 'Psychologie'
};
export interface UserDTO {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  specialty?: Speciality;
  doctorId?: number;
  rue?: string;
  ville?: string;
  codePostal?: string;
  dateDeNaissance?: string;
  numeroSecuriteSociale?: string;
}