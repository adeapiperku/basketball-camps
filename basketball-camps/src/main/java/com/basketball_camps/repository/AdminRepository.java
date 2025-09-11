package com.basketball_camps.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.basketball_camps.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
}
