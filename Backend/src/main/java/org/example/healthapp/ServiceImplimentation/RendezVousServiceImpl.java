package org.example.healthapp.ServiceImplimentation;

import org.example.healthapp.Repositories.RendezVousRepository;
import org.example.healthapp.Services.RendezVousService;
import org.example.healthapp.models.RendezVouz;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RendezVousServiceImpl implements RendezVousService {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Override
    public List<RendezVouz> findAllByDoctorId(Long doctorId) {
        return rendezVousRepository.findByDoctorId(doctorId);
    }

}
