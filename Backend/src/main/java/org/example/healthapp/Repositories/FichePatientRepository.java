package org.example.healthapp.Repositories;

import org.example.healthapp.models.FichePatient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FichePatientRepository extends JpaRepository<FichePatient, Long> {


}
