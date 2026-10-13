import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    {
      icon: '👨‍⚕️',
      title: 'Gestion des Médecins',
      description: 'Gérez facilement les profils et emplois du temps de vos médecins'
    },
    {
      icon: '📅',
      title: 'Rendez-vous',
      description: 'Planification simplifiée des rendez-vous patients'
    },
    {
      icon: '📊',
      title: 'Statistiques',
      description: 'Tableaux de bord et rapports détaillés'
    },
    {
      icon: '🔒',
      title: 'Sécurité',
      description: 'Protection des données médicales sensibles'
    }
  ];

  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}