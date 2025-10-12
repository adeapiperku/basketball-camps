package com.basketball_camps.repository;

import com.basketball_camps.model.CampRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import com.basketball_camps.enums.RegistrationStatus;

public interface CampRegistrationRepository extends JpaRepository<CampRegistration, Long> {
    List<CampRegistration> findByCampId(Long campId);
    
    // Find registrations by user ID
    List<CampRegistration> findByUserId(Long userId);
    
    // Find a specific registration by camp ID and user ID
    Optional<CampRegistration> findByCampIdAndUserId(Long campId, Long userId);
    
    // Count registrations by camp ID and status
    Long countByCampIdAndStatus(Long campId, RegistrationStatus status);
    
    // Find registrations by status
    List<CampRegistration> findByStatus(RegistrationStatus status);
}
