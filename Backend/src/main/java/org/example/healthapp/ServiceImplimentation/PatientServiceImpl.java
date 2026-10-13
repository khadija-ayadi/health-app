package org.example.healthapp.ServiceImplimentation;


import org.example.healthapp.Dto.RendezVousDto;
import org.example.healthapp.Dto.UserDTO;
import org.example.healthapp.Repositories.AdresseRepository;
import org.example.healthapp.Repositories.DoctorRepository;
import org.example.healthapp.Repositories.PatientRepository;
import org.example.healthapp.Repositories.RendezVousRepository;
import org.example.healthapp.Repositories.UserRepository;
import org.example.healthapp.Services.PatientService;
import org.example.healthapp.enumeration.Speciality;
import org.example.healthapp.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RendezVousRepository rendezVousRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DoctorRepository doctorRepository; // AJOUTEZ CECI
    @Autowired
    private AdresseRepository adresseRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Patient registerPatient(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already used");
        }

        Adresse adresse = new Adresse();
        adresse.setRue(userDTO.getRue());
        adresse.setVille(userDTO.getVille());
        adresse.setCodePostal(userDTO.getCodePostal());
        adresse = adresseRepository.save(adresse);

        Patient patient = new Patient();
        patient.setFirstName(userDTO.getFirstName());
        patient.setLastName(userDTO.getLastName());
        patient.setEmail(userDTO.getEmail());
        patient.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        patient.setPhone(userDTO.getPhone());
        patient.setRole(User.Role.PATIENT);
        patient.setAdresse(adresse);

        return userRepository.save(patient);
    }

    @Override
    public RendezVouz addRendezVous(Long patientId, Long doctorId, Speciality speciality, RendezVousDto rendezVousDto) {
        // ✅ CORRECTION : Utilisez patientRepository au lieu de userRepository
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // ✅ CORRECTION : Utilisez doctorRepository au lieu de userRepository
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!doctor.getSpecialty().equals(speciality)) {
            throw new IllegalArgumentException("Le docteur ne correspond pas à la spécialité demandée");
        }

        RendezVouz rendezVouz = new RendezVouz();
        rendezVouz.setPatient(patient);
        rendezVouz.setDoctor(doctor);
        patient.setDoctor(doctor);
        if (rendezVousDto.getDateRendezVous() != null) {
            rendezVouz.setDateRendezVous(rendezVousDto.getDateRendezVous());
        } else {
            rendezVouz.setDateRendezVous(LocalDateTime.now());
        }

        rendezVouz.setSpeciality(speciality);
        rendezVouz.setAccepted(false);
        rendezVouz.setDateDeNaissance(rendezVousDto.getDateDeNaissance());
        rendezVouz.setNumeroSecuriteSociale(rendezVousDto.getNumeroSecuriteSociale());

        String notes = rendezVousDto.getNotes();
        rendezVouz.setNotes(notes != null ? notes : "");

        return rendezVousRepository.save(rendezVouz);
    }

    @Override
    public RendezVouz updateRendezVous(Long rendezVousId, Long newDoctorId, Speciality newSpeciality, RendezVousDto rendezVousDto) {
        RendezVouz rendezVouz = rendezVousRepository.findById(rendezVousId)
                .orElseThrow(() -> new RuntimeException("Rendez-vous not found"));

        if (rendezVousDto.getDateRendezVous() != null) {
            rendezVouz.setDateRendezVous(rendezVousDto.getDateRendezVous());
        }

        String notes = rendezVousDto.getNotes();
        rendezVouz.setNotes(notes != null ? notes : "");

        if (newSpeciality != null) {
            rendezVouz.setSpeciality(newSpeciality);
        }

        if (newDoctorId != null) {
            // ✅ CORRECTION : Utilisez doctorRepository
            Doctor doctor = doctorRepository.findById(newDoctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            Speciality currentSpeciality = rendezVouz.getSpeciality();

            if (!doctor.getSpecialty().equals(currentSpeciality)) {
                throw new IllegalArgumentException("Le docteur ne correspond pas à la spécialité demandée");
            }

            rendezVouz.setDoctor(doctor);
        }

        rendezVouz.setDateDeNaissance(rendezVousDto.getDateDeNaissance());
        rendezVouz.setNumeroSecuriteSociale(rendezVousDto.getNumeroSecuriteSociale());

        return rendezVousRepository.save(rendezVouz);
    }

    @Override
    public void cancelRendezVous(Long rendezVousId) {
        RendezVouz rendezVouz = rendezVousRepository.findById(rendezVousId)
                .orElseThrow(() -> new RuntimeException("Rendez-vous not found"));
        rendezVousRepository.delete(rendezVouz);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Patient> findAllPatients(Long doctorId) {
        // Vérifier que le docteur existe
        Doctor doctor = (Doctor) userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Récupérer tous les rendez-vous du docteur
        List<RendezVouz> rendezVous = rendezVousRepository.findByDoctorId(doctorId);

        // Extraire les patients uniques
        return rendezVous.stream()
                .map(RendezVouz::getPatient)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<RendezVouz> getPatientRendezVous(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return rendezVousRepository.findAllByPatientId(patientId);
    }
}