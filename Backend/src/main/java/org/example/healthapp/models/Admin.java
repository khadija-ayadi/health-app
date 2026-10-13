package org.example.healthapp.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "admins" ,schema = "healthapp")
public class Admin extends User {

    public Admin() {
        super.setRole(Role.ADMIN);
    }
}