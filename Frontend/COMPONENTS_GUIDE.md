# Guide Complet - Création des Composants HealthApp

Ce document liste TOUS les composants à créer avec leur emplacement exact.

## ✅ Fichiers Déjà Créés

### Configuration
- ✅ package.json
- ✅ angular.json
- ✅ tsconfig.json
- ✅ tsconfig.app.json

### Models
- ✅ src/app/models/user.model.ts
- ✅ src/app/models/rendezvous.model.ts
- ✅ src/app/models/auth.model.ts

### Services
- ✅ src/app/services/auth.service.ts
- ✅ src/app/services/user.service.ts

### Guards
- ✅ src/app/guards/auth.guard.ts

### Components Shared
- ✅ src/app/components/shared/header/ (component + html + css)
- ✅ src/app/components/shared/footer/ (component + html + css)

### Components Auth
- ✅ src/app/components/auth/home/ (component + html + css)

## 📝 Composants À Créer

### 1. Login Component
**Fichier**: `src/app/components/auth/login/login.component.ts`
**Fichier**: `src/app/components/auth/login/login.component.html`
**Fichier**: `src/app/components/auth/login/login.component.css`

Le composant login doit :
- Avoir un formulaire avec email et password
- Appeler authService.login()
- Rediriger selon le rôle après connexion
- Afficher les erreurs

### 2. Admin Components

#### Admin Dashboard
**Fichier**: `src/app/components/admin/dashboard/dashboard.component.ts`
- Afficher les statistiques
- Liens vers gestion utilisateurs

#### Admin Users List
**Fichier**: `src/app/components/admin/users/users-list.component.ts`
- Liste tous les utilisateurs
- Bouton supprimer
- Bouton modifier

#### Admin Create User
**Fichier**: `src/app/components/admin/users/create-user.component.ts`
- Formulaire pour créer un utilisateur
- Sélection du rôle
- Champs conditionnels selon le rôle
- Pour DOCTOR : champ specialty
- Pour SECRETARY : champ doctorId

### 3. Doctor Components

#### Doctor Dashboard
**Fichier**: `src/app/components/doctor/dashboard/dashboard.component.ts`

#### Doctor Patients
**Fichier**: `src/app/components/doctor/patients/patients.component.ts`

#### Doctor Rendezvous
**Fichier**: `src/app/components/doctor/rendezvous/rendezvous.component.ts`

### 4. Secretary Components

#### Secretary Dashboard
**Fichier**: `src/app/components/secretary/dashboard/dashboard.component.ts`

#### Secretary Rendezvous
**Fichier**: `src/app/components/secretary/rendezvous/rendezvous.component.ts`
- Accepter RDV
- Annuler RDV

### 5. Patient Components

#### Patient Dashboard
**Fichier**: `src/app/components/patient/dashboard/dashboard.component.ts`

#### Patient Rendezvous
**Fichier**: `src/app/components/patient/rendezvous/rendezvous.component.ts`

#### Patient Create Rendezvous
**Fichier**: `src/app/components/patient/rendezvous/create-rendezvous.component.ts`

## 🔧 Fichiers de Configuration Manquants

### app.module.ts
**Fichier**: `src/app/app.module.ts`

Doit déclarer :
- Tous les composants
- Import HttpClientModule
- Import FormsModule, ReactiveFormsModule
- Provider pour HTTP_INTERCEPTORS

### app-routing.module.ts
**Fichier**: `src/app/app-routing.module.ts`

Routes:
```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  
  // Admin routes
  { 
    path: 'admin', 
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'users/create', component: CreateUserComponent },
      { path: 'users/:id/edit', component: EditUserComponent }
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
      { path: 'rendezvous', component: SecretaryRendezvousComponent }
    ]
  },
  
  // Patient routes
  { 
    path: 'patient', 
    canActivate: [AuthGuard],
    data: { roles: ['PATIENT'] },
    children: [
      { path: '', component: PatientDashboardComponent },
      { path: 'rendezvous', component: PatientRendezvousComponent },
      { path: 'rendezvous/create', component: CreateRendezvousComponent }
    ]
  },
  
  { path: '**', redirectTo: '' }
];
```

### app.component.ts
**Fichier**: `src/app/app.component.ts`

### app.component.html
**Fichier**: `src/app/app.component.html`

```html
<app-header></app-header>
<main class="main-content">
  <router-outlet></router-outlet>
</main>
<app-footer></app-footer>
```

### main.ts
**Fichier**: `src/main.ts`

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

### polyfills.ts
**Fichier**: `src/polyfills.ts`

```typescript
import 'zone.js';
```

### index.html
**Fichier**: `src/index.html`

### styles.css
**Fichier**: `src/styles.css`

Styles globaux pour l'application.

## 💡 Conseils de Développement

1. **Créer les composants un par un** dans cet ordre :
   - Login
   - Admin Dashboard et Create User
   - Doctor Dashboard
   - Secretary Dashboard
   - Patient Dashboard

2. **Tester chaque composant** avant de passer au suivant

3. **Utiliser les services déjà créés** :
   - AuthService pour l'authentification
   - UserService pour les utilisateurs

4. **Suivre la structure** du Header et Footer pour le style

## 🎨 Design Consistency

Toutes les pages doivent suivre :
- Même palette de couleurs (gradient violet)
- Même structure de cards
- Même boutons
- Responsive design

## 📦 Prochaine Étape

Je vais créer un projet Angular complet avec CLI qui génère TOUS ces composants automatiquement.

Voulez-vous que je génère le projet complet maintenant ?
