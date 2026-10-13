import { Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { ContactDto } from 'src/app/models/contact';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contact: ContactDto = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private contactService: ContactService) {}

  onSubmit(): void {
    // Validation
    if (!this.contact.name || !this.contact.email || !this.contact.subject || !this.contact.message) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.contact.email)) {
      this.errorMessage = 'Veuillez entrer un email valide';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Envoi du message de contact:', this.contact);

    this.contactService.sendMessage(this.contact).subscribe({
      next: (response) => {
        console.log('✅ Message envoyé:', response);
        this.successMessage = response.message;
        this.loading = false;
        
        // Réinitialiser le formulaire
        this.contact = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        };

        // Faire disparaître le message après 5 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('❌ Erreur:', error);
        this.errorMessage = error.error?.error || 'Erreur lors de l\'envoi du message';
        this.loading = false;

        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }
}