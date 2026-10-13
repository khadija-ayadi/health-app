package org.example.healthapp.Controller;

import org.example.healthapp.Dto.ContactDto;
import org.example.healthapp.Services.ContactService;
import org.example.healthapp.models.ContactMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    // -------------------- ENVOYER UN MESSAGE (Public) ---------------------------
    @PostMapping("/send")
    public ResponseEntity<?> sendContactMessage(@RequestBody ContactDto contactDto) {
        try {
            ContactMessage savedMessage = contactService.sendContactMessage(contactDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.",
                            "id", savedMessage.getId()
                    ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de l'envoi du message"));
        }
    }

    // -------------------- RÉCUPÉRER TOUS LES MESSAGES (Admin) ---------------------------
    @GetMapping("/all")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        try {
            List<ContactMessage> messages = contactService.getAllMessages();
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // -------------------- RÉCUPÉRER LES MESSAGES NON LUS (Admin) ---------------------------
    @GetMapping("/unread")
    public ResponseEntity<List<ContactMessage>> getUnreadMessages() {
        try {
            List<ContactMessage> messages = contactService.getUnreadMessages();
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // -------------------- COMPTER LES MESSAGES NON LUS (Admin) ---------------------------
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> countUnreadMessages() {
        try {
            long count = contactService.countUnreadMessages();
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // -------------------- MARQUER COMME LU (Admin) ---------------------------
    @PutMapping("/{id}/read")
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable Long id) {
        try {
            ContactMessage updatedMessage = contactService.markAsRead(id);
            return ResponseEntity.ok(updatedMessage);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // -------------------- SUPPRIMER UN MESSAGE (Admin) ---------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        try {
            contactService.deleteMessage(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}