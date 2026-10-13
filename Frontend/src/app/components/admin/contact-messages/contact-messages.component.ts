import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../services/contact.service';
import { ContactMessage } from 'src/app/models/contact';


@Component({
  selector: 'app-contact-messages',
  templateUrl: './contact-messages.component.html',
  styleUrls: ['./contact-messages.component.css']
})
export class ContactMessagesComponent implements OnInit {
  messages: ContactMessage[] = [];
  filteredMessages: ContactMessage[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Filtre
  filterStatus: 'all' | 'read' | 'unread' = 'all';
  unreadCount = 0;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.loadUnreadCount();
  }

  loadMessages(): void {
    this.loading = true;
    this.errorMessage = '';

    this.contactService.getAllMessages().subscribe({
      next: (messages) => {
        this.messages = messages.sort((a, b) => {
          // Trier par date décroissante (plus récent en premier)
          return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        });
        this.applyFilter();
        this.loading = false;
        console.log('✅ Messages chargés:', messages.length);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des messages';
        this.loading = false;
        console.error('❌ Error:', error);
      }
    });
  }

  loadUnreadCount(): void {
    this.contactService.countUnreadMessages().subscribe({
      next: (response) => {
        this.unreadCount = response.count;
      },
      error: (error) => {
        console.error('Error loading unread count:', error);
      }
    });
  }

  applyFilter(): void {
    if (this.filterStatus === 'all') {
      this.filteredMessages = [...this.messages];
    } else if (this.filterStatus === 'read') {
      this.filteredMessages = this.messages.filter(m => m.isRead);
    } else {
      this.filteredMessages = this.messages.filter(m => !m.isRead);
    }
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  markAsRead(message: ContactMessage): void {
    if (message.isRead) return;

    this.contactService.markAsRead(message.id!).subscribe({
      next: () => {
        message.isRead = true;
        this.successMessage = 'Message marqué comme lu';
        this.loadUnreadCount();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour';
        console.error('Error:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  deleteMessage(message: ContactMessage): void {
    if (!confirm(`Supprimer le message de ${message.name} ?`)) {
      return;
    }

    this.contactService.deleteMessage(message.id!).subscribe({
      next: () => {
        this.successMessage = 'Message supprimé avec succès';
        this.loadMessages();
        this.loadUnreadCount();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la suppression';
        console.error('Error:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  getStatusBadgeClass(message: ContactMessage): string {
    return message.isRead ? 'badge-success' : 'badge-warning';
  }

  getStatusText(message: ContactMessage): string {
    return message.isRead ? 'Lu' : 'Non lu';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}