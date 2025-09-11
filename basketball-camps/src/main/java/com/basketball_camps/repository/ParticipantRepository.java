package com.basketball_camps.repository;

import java.util.Optional;

import com.basketball_camps.model.Participant;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant,Long>{
    Optional<Participant> findByEmail(String email);
}
