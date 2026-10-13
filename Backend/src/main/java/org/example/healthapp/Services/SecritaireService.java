package org.example.healthapp.Services;

import org.example.healthapp.Dto.FichePatientDto;
import org.example.healthapp.models.FichePatient;
import org.example.healthapp.models.RendezVouz;
import org.springframework.stereotype.Service;

@Service
public interface SecritaireService {

    RendezVouz accepterRendezVouz(Long idRendezVouz);

    void annullerRendezVouz(Long idRendezVouz);

    FichePatient createFichePatient(Long idPatient, Long idDoctor);

}
