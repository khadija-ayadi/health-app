package org.example.healthapp.Controller;

import jakarta.persistence.EntityNotFoundException;
import org.example.healthapp.Services.SecritaireService;
import org.example.healthapp.models.RendezVouz;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/secritaire")
public class SecritaireController {

    @Autowired
    private SecritaireService secritaireService;

    @PutMapping("/rendezvous/{idRendezVouz}/accepter")
    public ResponseEntity<RendezVouz> accepterRendezVouz(@PathVariable Long idRendezVouz) {
        try {
            RendezVouz rendezVouz = secritaireService.accepterRendezVouz(idRendezVouz);
            return new ResponseEntity<>(rendezVouz, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/rendezvous/{idRendezVouz}/annuler")
    public ResponseEntity<Void> annullerRendezVouz(@PathVariable Long idRendezVouz) {
        try {
            secritaireService.annullerRendezVouz(idRendezVouz);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/fiche/{idPatient}/{idDoctor}")
    public ResponseEntity<?> createFichePatient(
            @PathVariable Long idPatient,
            @PathVariable Long idDoctor) {

        try {
            return new ResponseEntity<>(
                    secritaireService.createFichePatient(idPatient, idDoctor),
                    HttpStatus.CREATED
            );
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}