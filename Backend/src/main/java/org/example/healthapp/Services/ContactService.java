package org.example.healthapp.Services;

import org.example.healthapp.Dto.ContactDto;
import org.example.healthapp.models.ContactMessage;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ContactService {

    // Envoyer un message de contact
    ContactMessage sendContactMessage(ContactDto contactDto);

    // Récupérer tous les messages de contact (pour admin)
    List<ContactMessage> getAllMessages();

    // Récupérer les messages non lus
    List<ContactMessage> getUnreadMessages();

    // Marquer un message comme lu
    ContactMessage markAsRead(Long messageId);

    // Supprimer un message
    void deleteMessage(Long messageId);

    // Compter les messages non lus
    long countUnreadMessages();
}