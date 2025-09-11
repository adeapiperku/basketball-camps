package com.basketball_camps.repository;

import java.util.Optional;

import com.basketball_camps.model.Coach;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CoachRepository extends JpaRepository<Coach,Long>{
    Optional<Coach> findByEmail(String email);
}
