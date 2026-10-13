import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/auth/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';

// Admin
import { AdminDashboardComponent } from './components/admin/dashboard/dashboard.component';

import { CreateUserComponent } from './components/admin/users/create-user.component';

// Doctor
import { DoctorDashboardComponent } from './components/doctor/dashboard/dashboard.component';
import { DoctorPatientsComponent } from './components/doctor/patients/patients.component';
import { DoctorRendezvousComponent } from './components/doctor/rendezvous/rendezvous.component';

// Secretary
import { SecretaryDashboardComponent } from './components/secretary/dashboard/dashboard.component';

// Patient
import { PatientDashboardComponent } from './components/patient/dashboard/dashboard.component';
import { CreateRendezvousComponent } from './components/patient/create-rendezvous/create-rendezvous.component';
import { PatientRendezvousListComponent } from './components/patient/rendezvous-list/rendezvous-list.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactMessagesComponent } from './components/admin/contact-messages/contact-messages.component';
import { UserListComponent } from './components/admin/users/user-list/user-list.component';

const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },  // ← REGISTER PUBLIC
  { path: 'contact', component: ContactComponent },

  // Admin routes
  { 
    path: 'admin', 
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users/create', component: CreateUserComponent }, 
      { path: 'users/list', component: UserListComponent }, 
      { path: 'messages', component: ContactMessagesComponent }  // ← REGISTER ADMIN
    ]
  },

  // Doctor routes
  {
    path: 'doctor',
    canActivate: [AuthGuard],
    data: { roles: ['DOCTOR'] },
    children: [
      { path: '', component: DoctorDashboardComponent },
      { path: 'patients', component: DoctorPatientsComponent },
      { path: 'rendezvous', component: DoctorRendezvousComponent }
    ]
  },

  // Secretary routes
  {
    path: 'secretary',
    canActivate: [AuthGuard],
    data: { roles: ['SECRETARY'] },
    children: [
      { path: '', component: SecretaryDashboardComponent },
      { path: 'patients', component: DoctorPatientsComponent },
      { path: 'rendezvous', component: DoctorRendezvousComponent }
    ]
  },

  // Patient routes
{ 
  path: 'patient', 
  canActivate: [AuthGuard],
  data: { roles: ['PATIENT'] },
  children: [
    { path: '', component: PatientDashboardComponent },
    { path: 'rendezvous', component: PatientRendezvousListComponent },
    { path: 'rendezvous/create', component: CreateRendezvousComponent },
    { path: 'rendezvous/:id/edit', component: CreateRendezvousComponent }
  ]
},

  // Wildcard
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
