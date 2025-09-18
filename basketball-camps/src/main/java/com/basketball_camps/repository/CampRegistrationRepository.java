package com.basketball_camps.repository;

import com.basketball_camps.model.CampRegistration;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import com.basketball_camps.enums.RegistrationStatus;

public interface CampRegistrationRepository extends JpaRepository<CampRegistration, Long> {
    List<CampRegistration> findByCampId(Long campId);
    List<CampRegistration> findByParticipantId(Long participantId);
    Optional<CampRegistration> findByCampIdAndParticipantId(Long campId, Long participantId);
    Long countByCampIdAndStatus(Long campId, RegistrationStatus status);
}
