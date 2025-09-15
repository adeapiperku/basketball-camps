package com.basketball_camps.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.basketball_camps.model.School;

public interface SchoolRepository extends JpaRepository<School, Long> {

}
