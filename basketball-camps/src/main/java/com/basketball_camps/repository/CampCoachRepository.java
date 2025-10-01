package com.basketball_camps.repository;

import com.basketball_camps.model.CampCoach;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CampCoachRepository extends JpaRepository<CampCoach, Long> {
    List<CampCoach> findByCampId(Long campId);
}
