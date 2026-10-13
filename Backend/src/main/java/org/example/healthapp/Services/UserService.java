package org.example.healthapp.Services;

import org.example.healthapp.Dto.UserDTO;
import org.example.healthapp.models.User;
import java.util.List;

public interface UserService {
    User createUser(UserDTO UserDto);
    User getUsersByRole(User.Role role);
    List<User> getAllUsers();
    User getUserById(Long id);
    User updateUser(UserDTO UserDto,Long id);
    boolean deleteUser(Long id);

    }
