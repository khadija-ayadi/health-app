package org.example.healthapp.Dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.example.healthapp.enumeration.Speciality;
import org.example.healthapp.models.Doctor;
import org.example.healthapp.models.Patient;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class RendezVousDto {

    private Long id;

    private Patient patient;

    private Doctor doctor;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateRendezVous;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateDeNaissance;

    private Speciality speciality;

    private String notes;

    private boolean accepted;

    // FIXED: Changed from int to String
    private String numeroSecuriteSociale;
}