package org.example.healthapp.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "patients")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Patient extends User {

    @ManyToOne(fetch = FetchType.EAGER) // Changez en EAGER temporairement
    @JoinColumn(name = "doctor_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private Doctor doctor;

    public Patient() {
        super.setRole(Role.PATIENT);
    }
}