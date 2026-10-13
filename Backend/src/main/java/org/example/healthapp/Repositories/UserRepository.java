package org.example.healthapp.Repositories;


import org.example.healthapp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByRole(User.Role role);

    Optional<User> findByEmail(String email);


}
