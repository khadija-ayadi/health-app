//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package org.example.healthapp.Repositories;


import org.example.healthapp.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.doctor WHERE p.doctor.id = :doctorId")
    List<Patient> findAllByDoctorId(@Param("doctorId") Long doctorId);
}
