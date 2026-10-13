package org.example.healthapp.Services;

import org.example.healthapp.models.RendezVouz;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RendezVousService {

    List<RendezVouz> findAllByDoctorId(Long doctorId);
}
