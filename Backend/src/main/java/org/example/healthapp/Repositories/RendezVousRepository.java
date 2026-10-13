package org.example.healthapp.Repositories;

import org.example.healthapp.models.RendezVouz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVouz,Long> {

    List<RendezVouz> findByDoctorId(Long doctorId);

    RendezVouz findByPatientId(Long patientId);

    List<RendezVouz> findAllByPatientId(Long patientId);
}
