package org.example.healthapp.ServiceImplimentation;

import org.example.healthapp.Dto.UserDTO;
import org.example.healthapp.Repositories.AdresseRepository;
import org.example.healthapp.Repositories.UserRepository;
import org.example.healthapp.Services.UserService;
import org.example.healthapp.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdresseRepository adresseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // -------------------- FACTORY METHOD ---------------------------
    private User createUserInstance(User.Role role) {
        return switch (role) {
            case ADMIN -> new Admin();
            case DOCTOR -> new Doctor();
            case SECRETARY -> new Secretary();
            case PATIENT -> new Patient();
            default -> throw new IllegalArgumentException("Rôle non supporté : " + role);
        };
    }

    // -------------------- CREATE ---------------------------
    @Override
    public User createUser(UserDTO userDto) {

        User user = createUserInstance(userDto.getRole());

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(userDto.getRole());


            Adresse adresse = new Adresse();
            adresse.setRue(userDto.getRue());
            adresse.setVille(userDto.getVille());
            adresse.setCodePostal(userDto.getCodePostal());
            adresse = adresseRepository.save(adresse);
            user.setAdresse(adresse);


        if (user instanceof Doctor doctor) {
            if (userDto.getSpecialty() == null) {
                throw new IllegalArgumentException("La spécialité est obligatoire pour un docteur");
            }
            doctor.setSpecialty(userDto.getSpecialty());
            doctor.setAdresse(adresse);

        }

        if (user instanceof Secretary secretary) {
            List<Doctor> doctors = userRepository.findAll()
                    .stream()
                    .filter(u -> u instanceof Doctor)
                    .map(u -> (Doctor) u)
                    .toList();

            if (doctors.isEmpty()) {
                throw new IllegalStateException("Aucun docteur disponible pour être associé à une secrétaire");
            }

            if (userDto.getDoctorId() != null) {
                Doctor selectedDoctor = doctors.stream()
                        .filter(d -> d.getId().equals(userDto.getDoctorId()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("Docteur avec l'ID " + userDto.getDoctorId() + " introuvable"));
                secretary.setDoctor(selectedDoctor);
            } else {
                secretary.setDoctor(doctors.get(0));
            }
        }

        return userRepository.save(user);
    }



    // -------------------- GET BY ROLE ---------------------------
    @Override
    public User getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    // -------------------- GET All users ---------------------------
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // -------------------- GET BY ID ---------------------------
    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // -------------------- UPDATE ---------------------------
    @Override
    public User updateUser(UserDTO updateDto, Long id) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur avec l'ID " + id + " introuvable"));

        if (updateDto.getFirstName() != null && !updateDto.getFirstName().isBlank()) {
            existingUser.setFirstName(updateDto.getFirstName());
        }

        if (updateDto.getLastName() != null && !updateDto.getLastName().isBlank()) {
            existingUser.setLastName(updateDto.getLastName());
        }

        if (updateDto.getEmail() != null && !updateDto.getEmail().isBlank()) {

            userRepository.findByEmail(updateDto.getEmail())
                    .ifPresent(user -> {
                        if (!user.getId().equals(id)) {
                            throw new IllegalArgumentException("Cet email est déjà utilisé");
                        }
                    });
            existingUser.setEmail(updateDto.getEmail());
        }

        if (updateDto.getPhone() != null && !updateDto.getPhone().isBlank()) {
            existingUser.setPhone(updateDto.getPhone());
        }

        if (existingUser instanceof Doctor doctor && updateDto.getSpecialty() != null) {
            doctor.setSpecialty(updateDto.getSpecialty());
        }

        if (existingUser instanceof Secretary secretary && updateDto.getDoctorId() != null) {
            Doctor newDoctor = userRepository.findById(updateDto.getDoctorId())
                    .filter(u -> u instanceof Doctor)
                    .map(u -> (Doctor) u)
                    .orElseThrow(() -> new IllegalArgumentException("Docteur avec l'ID " + updateDto.getDoctorId() + " introuvable"));

            secretary.setDoctor(newDoctor);
        }

        if (updateDto.getPassword() != null && !updateDto.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(updateDto.getPassword()));
        }

        return userRepository.save(existingUser);
    }


    // -------------------- DELETE ---------------------------
    @Override
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

