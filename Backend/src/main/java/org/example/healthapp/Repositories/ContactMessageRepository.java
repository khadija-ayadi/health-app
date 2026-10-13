package org.example.healthapp.Repositories;

import org.example.healthapp.models.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    // Trouver tous les messages non lus
    List<ContactMessage> findByIsReadFalse();

    // Trouver tous les messages par email
    List<ContactMessage> findByEmailOrderByCreatedAtDesc(String email);

    // Compter les messages non lus
    long countByIsReadFalse();
}