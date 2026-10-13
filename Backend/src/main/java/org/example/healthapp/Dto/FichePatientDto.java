package org.example.healthapp.Dto;

import lombok.Data;

@Data
public class FichePatientDto {

    private Long id;

    private String nomPatient;

    private String prenomPatient;

    private String adresse;

    private String telephone;

    private String email;

    private String dateDeNaissance;

    private String numeroSecuriteSociale;
}
