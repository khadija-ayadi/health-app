package org.example.healthapp.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "fiche_patient", schema = "healthApp")
@Getter
@Setter
public class FichePatient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomPatient;

    private String prenomPatient;

    private String nomDoctor;

    private String prenomDoctor;

    private String specialiteDoctor;

    private String adressePatient;

    private String adresseDoctor;

    private String telephone;

    private String email;

    private String dateDeNaissance;

    private String numeroSecuriteSociale;

}
