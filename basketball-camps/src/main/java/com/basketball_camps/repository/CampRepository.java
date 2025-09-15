package com.basketball_camps.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.basketball_camps.model.Camp;

public interface CampRepository extends JpaRepository<Camp, Long> {

}
