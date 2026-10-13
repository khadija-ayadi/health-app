package org.example.healthapp.Controller;


import org.example.healthapp.Services.RendezVousService;
import org.example.healthapp.models.RendezVouz;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/rendezvous")
public class RendezVousController {

    @Autowired
    private RendezVousService rendezVousService;

    // -------------------- GET ALL RENDEZ-VOUS OF A DOCTOR ---------------------------
    @GetMapping("/doctor/{doctorId}")
    public List<RendezVouz> getRendezVousByDoctor(@PathVariable Long doctorId) {
        return rendezVousService.findAllByDoctorId(doctorId);
    }

}
