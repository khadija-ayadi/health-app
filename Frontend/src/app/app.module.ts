import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Shared Components
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';

// Auth Components
import { HomeComponent } from './components/auth/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';

// Admin Components
import { AdminDashboardComponent } from './components/admin/dashboard/dashboard.component';

import { CreateUserComponent } from './components/admin/users/create-user.component';

// Doctor Components
import { DoctorDashboardComponent } from './components/doctor/dashboard/dashboard.component';
import { DoctorPatientsComponent } from './components/doctor/patients/patients.component';
import { DoctorRendezvousComponent } from './components/doctor/rendezvous/rendezvous.component';

// Secretary Components
import { SecretaryDashboardComponent } from './components/secretary/dashboard/dashboard.component';

// Patient Components
import { PatientDashboardComponent } from './components/patient/dashboard/dashboard.component';

// Interceptors
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { CreateRendezvousComponent } from './components/patient/create-rendezvous/create-rendezvous.component';
import { PatientRendezvousListComponent } from './components/patient/rendezvous-list/rendezvous-list.component';
import { PdfViewerModalComponent } from './components/pdf-viewer-modal-component/pdf-viewer-modal-component.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserListComponent } from './components/admin/users/user-list/user-list.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactMessagesComponent } from './components/admin/contact-messages/contact-messages.component';



@NgModule({
  declarations: [
    AppComponent,   
    // Shared
    HeaderComponent,
    FooterComponent,
    // Auth
    HomeComponent,
    LoginComponent,
    // Admin
    AdminDashboardComponent,
    CreateUserComponent,
    // Doctor
    DoctorDashboardComponent,
    DoctorPatientsComponent,
    DoctorRendezvousComponent,
    // Secretary
    SecretaryDashboardComponent,
    // Patient
    PatientDashboardComponent,
    CreateRendezvousComponent,
    PatientRendezvousListComponent,
    PdfViewerModalComponent,
    RegisterComponent,
    UserListComponent,
    ContactComponent,
    ContactMessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
