package com.basketball_camps.repository;

import com.basketball_camps.model.CampRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import com.basketball_camps.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CampRegistrationRepository extends JpaRepository<CampRegistration, Long> {
    
    @Query("SELECT cr FROM CampRegistration cr " +
           "LEFT JOIN FETCH cr.camp " +
           "LEFT JOIN FETCH cr.participant " +
           "LEFT JOIN FETCH cr.school " +
           "WHERE cr.camp.id = :campId")
    List<CampRegistration> findByCampId(@Param("campId") Long campId);
    
    @Query("SELECT cr FROM CampRegistration cr " +
           "LEFT JOIN FETCH cr.camp " +
           "LEFT JOIN FETCH cr.participant " +
           "LEFT JOIN FETCH cr.school " +
           "WHERE cr.participant.id = :participantId")
    List<CampRegistration> findByParticipantId(@Param("participantId") Long participantId);
        
    @Query("SELECT cr FROM CampRegistration cr " +
           "LEFT JOIN FETCH cr.camp " +
           "LEFT JOIN FETCH cr.participant " +
           "LEFT JOIN FETCH cr.school " +
           "WHERE cr.camp.id = :campId AND cr.participant.id = :participantId")
    Optional<CampRegistration> findByCampIdAndParticipantId(
        @Param("campId") Long campId, 
        @Param("participantId") Long participantId
    );
    
    @Query("SELECT COUNT(cr) FROM CampRegistration cr " +
           "WHERE cr.camp.id = :campId AND cr.status = :status")
    Long countByCampIdAndStatus(
        @Param("campId") Long campId, 
        @Param("status") RegistrationStatus status
    );
    
    @Query("SELECT cr FROM CampRegistration cr " +
           "LEFT JOIN FETCH cr.camp " +
           "LEFT JOIN FETCH cr.participant " +
           "LEFT JOIN FETCH cr.school " +
           "WHERE cr.status = :status")
    List<CampRegistration> findByStatus(@Param("status") RegistrationStatus status);
}
