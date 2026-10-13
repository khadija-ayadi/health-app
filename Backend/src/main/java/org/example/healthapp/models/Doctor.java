package org.example.healthapp.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.healthapp.enumeration.Speciality;

@Getter
@Setter
@Entity
@Table(name = "doctors")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor extends User {

    @Enumerated(EnumType.STRING)
    private Speciality specialty;

    public Doctor() {
        super.setRole(Role.DOCTOR);
    }
}