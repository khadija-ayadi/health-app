package org.example.healthapp.Controller;


import org.example.healthapp.Dto.RendezVousDto;
import org.example.healthapp.Dto.UserDTO;
import org.example.healthapp.Services.PatientService;
import org.example.healthapp.enumeration.Speciality;
import org.example.healthapp.models.Patient;
import org.example.healthapp.models.RendezVouz;
import org.example.healthapp.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/register")
    public ResponseEntity<?> registerPatient(@RequestBody UserDTO userDTO) {
        try {
            // Forcer le rôle PATIENT pour la sécurité
            userDTO.setRole(User.Role.PATIENT);

            Patient patient = patientService.registerPatient(userDTO);
            return new ResponseEntity<>(patient, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{patientId}/rendezvous")
    public ResponseEntity<?> createRendezVous(
            @PathVariable Long patientId,
            @RequestParam Long doctorId,
            @RequestParam Speciality speciality,
            @RequestBody RendezVousDto rendezVousDto) {

        try {
            RendezVouz rendezVouz = patientService.addRendezVous(
                    patientId,
                    doctorId,
                    speciality,
                    rendezVousDto
            );
            return ResponseEntity.ok(rendezVouz);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur serveur: " + e.getMessage()));
        }
    }

    @PutMapping("/rendezvous/{rendezVousId}")
    public ResponseEntity<RendezVouz> updateRendezVous(
            @PathVariable Long rendezVousId,
            @RequestParam(required = false) Long newDoctorId,
            @RequestParam(required = false) Speciality newSpeciality,
            @RequestBody RendezVousDto rendezVousDto) {
        try {
            RendezVouz updatedRendezVous = patientService.updateRendezVous(rendezVousId, newDoctorId, newSpeciality,rendezVousDto);
            return new ResponseEntity<>(updatedRendezVous, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/rendezvous/{rendezVousId}")
    public ResponseEntity<Void> cancelRendezVous(@PathVariable Long rendezVousId) {
        try {
            patientService.cancelRendezVous(rendezVousId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Patient>> findAllPatients(@PathVariable Long doctorId) {
        List<Patient> patients = patientService.findAllPatients(doctorId);
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/{patientId}/rendezvous")
    public ResponseEntity<List<RendezVouz>> getPatientRendezVous(@PathVariable Long patientId) {
        try {
            List<RendezVouz> rendezVous = patientService.getPatientRendezVous(patientId);
            return new ResponseEntity<>(rendezVous, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

}