package org.example.healthapp.Dto;

import lombok.Data;
import org.example.healthapp.enumeration.Speciality;
import org.example.healthapp.models.User;

@Data
public class UserDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String password;

    private Speciality speciality;

    private User.Role role;

    private Speciality specialty;

    private Long doctorId;

    private String rue;

    private String ville;

    private String codePostal;

}