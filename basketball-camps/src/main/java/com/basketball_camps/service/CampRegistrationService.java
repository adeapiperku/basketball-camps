package com.basketball_camps.service;

import com.basketball_camps.enums.JerseySize;
import com.basketball_camps.enums.RegistrationStatus;
import com.basketball_camps.exception.EntityValidationException;
import com.basketball_camps.exception.ExceptionPayload;
import com.basketball_camps.exception.NotFoundApiException;
import com.basketball_camps.model.Camp;
import com.basketball_camps.model.CampRegistration;
import com.basketball_camps.model.Participant;
import com.basketball_camps.model.School;
import com.basketball_camps.repository.CampRegistrationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CampRegistrationService extends BasicServiceOperations<CampRegistrationRepository, CampRegistration> {

    private final CampService campService;
    private final ParticipantService participantService;
    private final SchoolService schoolService;

    public CampRegistrationService(CampRegistrationRepository repository, CampService campService,
            ParticipantService participantService, SchoolService schoolService) {
        super(repository);
        this.campService = campService;
        this.participantService = participantService;
        this.schoolService = schoolService;
    }

    @Transactional
    public CampRegistration registerParticipant(Long campId, Long participantId, Long schoolId,
            String specialRequests, String jerseySizeStr) {

        Camp camp = campService.findById(campId);
        if (camp == null) {
            throw new NotFoundApiException(HttpStatus.NOT_FOUND)
                    .addParameter("Camp not found with id: " + campId);
        }

        Participant participant = participantService.findById(participantId);
        if (participant == null) {
            throw new NotFoundApiException(HttpStatus.NOT_FOUND)
                    .addParameter("Participant not found with id: " + participantId);
        }

        try {
            JerseySize jerseySize = null;
            if (jerseySizeStr != null && !jerseySizeStr.isEmpty()) {
                try {
                    jerseySize = JerseySize.valueOf(jerseySizeStr.toUpperCase());
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid jersey size: " + jerseySizeStr);
                }
            }

            School school = schoolService.findById(schoolId);
            if (school == null) {
                throw new NotFoundApiException("School not found with id: " + schoolId, HttpStatus.NOT_FOUND);
            }

            validateRegistration(camp, participant);

            CampRegistration registration = new CampRegistration();
            registration.setCamp(camp);
            registration.setParticipant(participant);
            registration.setSchool(school);
            registration.setRegisteredAt(LocalDateTime.now());
            registration.setSpecialRequests(specialRequests);
            registration.setJerseySize(jerseySize);

            if (camp.getPrice() == null) {
                throw new IllegalStateException("Camp price is not set");
            }
            registration.setAmountPaid(camp.getPrice());
            registration.setStatus(RegistrationStatus.PENDING);

            if (camp.getCurrentParticipants() < camp.getMaxParticipants()) {
                registration.setStatus(RegistrationStatus.CONFIRMED);
                registration.setConfirmedAt(LocalDateTime.now());
                camp.incrementParticipants();
                campService.save(camp);
            } else {
                registration.setStatus(RegistrationStatus.WAITLIST);
            }

            return repository.save(registration);
        } catch (Exception e) {
            log.error("Error in registerParticipant", e);
            throw e;
        }
    }

    @Transactional
    public void confirmRegistration(Long registrationId) {
        CampRegistration registration = repository.findById(registrationId)
                .orElseThrow(() -> new NotFoundApiException(HttpStatus.NOT_FOUND)
                        .addParameter("Registration not found with id: " + registrationId));

        if (registration.getStatus() == RegistrationStatus.PENDING) {
            registration.setStatus(RegistrationStatus.CONFIRMED);
            registration.setConfirmedAt(LocalDateTime.now());
            registration.getCamp().incrementParticipants();
            campService.save(registration.getCamp());
            repository.save(registration);
        } else {
            throw new IllegalStateException("Cannot confirm registration with status: " + registration.getStatus());
        }
    }

    @Transactional
    public void cancelRegistration(Long registrationId) {
        CampRegistration registration = repository.findById(registrationId)
                .orElseThrow(() -> new NotFoundApiException(HttpStatus.NOT_FOUND)
                        .addParameter("Registration not found with id: " + registrationId));

        if (registration.canBeCancelled()) {
            boolean wasConfirmed = registration.getStatus() == RegistrationStatus.CONFIRMED;

            registration.setStatus(RegistrationStatus.CANCELLED);
            registration.setCancelledAt(LocalDateTime.now());

            if (wasConfirmed) {
                registration.getCamp().decrementParticipants();
                campService.save(registration.getCamp());
            }

            repository.save(registration);

            promoteWaitlistParticipant(registration.getCamp().getId());
        } else {
            throw new IllegalStateException("Registration cannot be cancelled");
        }
    }

    @Transactional(readOnly = true)
    public List<CampRegistration> findByCampId(Long campId) {
        try {
            if (campId == null) {
                throw new IllegalArgumentException("Camp ID cannot be null");
            }

            List<CampRegistration> registrations = repository.findByCampId(campId);
            if (registrations != null) {
                for (CampRegistration reg : registrations) {
                    if (reg.getParticipant() != null) {
                        reg.getParticipant().getId();
                    }
                }
            }

            return registrations;
        } catch (Exception e) {
            log.error("Error finding registrations for camp " + campId, e);
            throw new RuntimeException("Failed to fetch registrations for camp: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<CampRegistration> findByParticipantId(Long participantId) {
        return repository.findByParticipantId(participantId);
    }

    @Transactional(readOnly = true)
    public Optional<CampRegistration> findByCampIdAndParticipantId(Long campId, Long participantId) {
        return repository.findByCampIdAndParticipantId(campId, participantId);
    }

    public List<CampRegistration> findByStatus(RegistrationStatus status) {
        return repository.findByStatus(status);
    }

    private void validateRegistration(Camp camp, Participant participant) {
        if (!camp.isRegistrationOpen()) {
            ExceptionPayload payload = ExceptionPayload.builder()
                    .message("Registration is closed for this camp")
                    .code("REGISTRATION_CLOSED")
                    .build();
            throw new EntityValidationException(payload);
        }

        if (isAlreadyRegistered(camp.getId(), participant.getId())) {
            ExceptionPayload payload = ExceptionPayload.builder()
                    .message("participant already registered for this camp")
                    .code("ALREADY_REGISTERED")
                    .build();
            throw new EntityValidationException(payload);
        }
    }

    private boolean isAlreadyRegistered(Long campId, Long participantId) {
        return repository.findByCampIdAndParticipantId(campId, participantId).isPresent();
    }

    private void promoteWaitlistParticipant(Long campId) {
        List<CampRegistration> waitlistRegistrations = repository.findByCampId(campId)
                .stream()
                .filter(reg -> reg.getStatus() == RegistrationStatus.WAITLIST)
                .sorted((r1, r2) -> r1.getRegisteredAt().compareTo(r2.getRegisteredAt()))
                .toList();

        if (!waitlistRegistrations.isEmpty()) {
            CampRegistration nextRegistration = waitlistRegistrations.get(0);
            nextRegistration.setStatus(RegistrationStatus.CONFIRMED);
            nextRegistration.setConfirmedAt(LocalDateTime.now());
            repository.save(nextRegistration);
        }
    }
}