package org.example.healthapp.Controller;


import org.example.healthapp.Dto.UserDTO;
import org.example.healthapp.Repositories.UserRepository;
import org.example.healthapp.Services.UserService;
import org.example.healthapp.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    // -------------------- CREATE USER ---------------------------
    @PostMapping("/create")
    public User createUser(@RequestBody UserDTO userDto) {
        return userService.createUser(userDto);
    }

    // -------------------- GET ALL BY ROLE ---------------------------
    @GetMapping("/role/{role}")
    public User getUsersByRole(@PathVariable User.Role role) {
        return userService.getUsersByRole(role);
    }

    // -------------------- GET ALL Users ---------------------------
    @GetMapping("/All-Users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // -------------------- GET BY ID ---------------------------
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // -------------------- UPDATE USER ---------------------------
    @PutMapping("/update/{id}")
    public User updateUser(@RequestBody UserDTO userDto, @PathVariable Long id) {
        return userService.updateUser(userDto, id);
    }

    // -------------------- DELETE USER ---------------------------
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);

        return deleted ? "User deleted successfully." : "User not found.";
    }
}
