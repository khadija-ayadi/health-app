package org.example.healthapp.ServiceImplimentation;

import jakarta.persistence.EntityNotFoundException;
import org.example.healthapp.Repositories.FichePatientRepository;
import org.example.healthapp.Repositories.RendezVousRepository;
import org.example.healthapp.Repositories.UserRepository;
import org.example.healthapp.Services.SecritaireService;
import org.example.healthapp.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class SecritaireServiceImpl implements SecritaireService {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FichePatientRepository fichePatientRepository;

    /**
     * @param idRendezVouz
     * @return
     */
    @Override
    public RendezVouz accepterRendezVouz(Long idRendezVouz) {
        RendezVouz rendezVouz = rendezVousRepository.findById(idRendezVouz).orElseThrow(() ->
                new EntityNotFoundException("Rendez-vous not found with id " + idRendezVouz));
        rendezVouz.setAccepted(true);
        return rendezVousRepository.save(rendezVouz);
    }

    /**
     * @param idRendezVouz
     */
    @Override
    public void annullerRendezVouz(Long idRendezVouz) {
        RendezVouz rendezVouz = rendezVousRepository.findById(idRendezVouz).orElseThrow(() ->
                new EntityNotFoundException("Rendez-vous not found with id " + idRendezVouz));
        rendezVousRepository.delete(rendezVouz);
    }

    /**
     * @param idPatient
     * @param idDoctor
     * @return
     */
    @Override
    public FichePatient createFichePatient(Long idPatient, Long idDoctor) {

        User userPatient = userRepository.findById(idPatient)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with id " + idPatient));

        if (!(userPatient instanceof Patient patient)) {
            throw new IllegalArgumentException("User with id " + idPatient + " is not a patient");
        }

        User userDoctor = userRepository.findById(idDoctor)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with id " + idDoctor));

        if (!(userDoctor instanceof Doctor doctor)) {
            throw new IllegalArgumentException("User with id " + idDoctor + " is not a doctor");
        }

        RendezVouz rendezVouz = rendezVousRepository.findByPatientId(patient.getId());

        FichePatient fiche = new FichePatient();

        fiche.setNomDoctor(doctor.getFirstName());
        fiche.setPrenomDoctor(doctor.getLastName());
        fiche.setSpecialiteDoctor(String.valueOf(doctor.getSpecialty()));
        fiche.setAdresseDoctor( doctor.getAdresse().getRue() + " " + doctor.getAdresse().getVille() + " " + doctor.getAdresse().getCodePostal());
        fiche.setNomPatient(patient.getFirstName());
        fiche.setPrenomPatient(patient.getLastName());
        fiche.setTelephone(patient.getPhone());
        fiche.setEmail(patient.getEmail());
        fiche.setDateDeNaissance(rendezVouz.getDateDeNaissance().toString());
        fiche.setNumeroSecuriteSociale(String.valueOf(rendezVouz.getNumeroSecuriteSociale()));


        return fichePatientRepository.save(fiche);
    }

}
