package org.example.healthapp.ServiceImplimentation;

import org.example.healthapp.Dto.ContactDto;
import org.example.healthapp.Repositories.ContactMessageRepository;
import org.example.healthapp.Services.ContactService;
import org.example.healthapp.models.ContactMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Override
    public ContactMessage sendContactMessage(ContactDto contactDto) {
        // Valider les données
        if (contactDto.getName() == null || contactDto.getName().isBlank()) {
            throw new IllegalArgumentException("Le nom est obligatoire");
        }

        if (contactDto.getEmail() == null || contactDto.getEmail().isBlank()) {
            throw new IllegalArgumentException("L'email est obligatoire");
        }

        if (contactDto.getSubject() == null || contactDto.getSubject().isBlank()) {
            throw new IllegalArgumentException("Le sujet est obligatoire");
        }

        if (contactDto.getMessage() == null || contactDto.getMessage().isBlank()) {
            throw new IllegalArgumentException("Le message est obligatoire");
        }

        // Créer le message de contact
        ContactMessage contactMessage = new ContactMessage(
                contactDto.getName(),
                contactDto.getEmail(),
                contactDto.getPhone(),
                contactDto.getSubject(),
                contactDto.getMessage()
        );

        // Sauvegarder dans la base de données
        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);

        System.out.println("✅ Message de contact reçu de: " + contactDto.getEmail());
        System.out.println("📧 Sujet: " + contactDto.getSubject());

        // TODO: Envoyer un email de notification à l'admin (optionnel)
        // emailService.sendContactNotification(savedMessage);

        return savedMessage;
    }

    @Override
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    @Override
    public List<ContactMessage> getUnreadMessages() {
        return contactMessageRepository.findByIsReadFalse();
    }

    @Override
    public ContactMessage markAsRead(Long messageId) {
        ContactMessage message = contactMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message non trouvé avec l'ID: " + messageId));

        message.setIsRead(true);
        return contactMessageRepository.save(message);
    }

    @Override
    public void deleteMessage(Long messageId) {
        if (!contactMessageRepository.existsById(messageId)) {
            throw new RuntimeException("Message non trouvé avec l'ID: " + messageId);
        }
        contactMessageRepository.deleteById(messageId);
    }

    @Override
    public long countUnreadMessages() {
        return contactMessageRepository.countByIsReadFalse();
    }
}