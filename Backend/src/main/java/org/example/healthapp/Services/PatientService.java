
package org.example.healthapp.Services;

import java.util.List;

import org.example.healthapp.Dto.RendezVousDto;
import org.example.healthapp.Dto.UserDTO;
import org.example.healthapp.enumeration.Speciality;
import org.example.healthapp.models.Patient;
import org.example.healthapp.models.RendezVouz;

public interface PatientService {

    Patient registerPatient(UserDTO userDTO);

    RendezVouz addRendezVous(Long patientId, Long doctorId, Speciality speciality, RendezVousDto rendezVousDto);

    public RendezVouz updateRendezVous(Long rendezVousId, Long newDoctorId, Speciality newSpeciality, RendezVousDto rendezVousDto);

    public void cancelRendezVous(Long rendezVousId);

    public List<Patient> findAllPatients(Long doctorId);

    List<RendezVouz> getPatientRendezVous(Long patientId);
}
