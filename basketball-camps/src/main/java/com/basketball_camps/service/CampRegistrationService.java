package com.basketball_camps.service;

import com.basketball_camps.enums.JerseySize;
import com.basketball_camps.enums.RegistrationStatus;
import com.basketball_camps.exception.EntityValidationException;
import com.basketball_camps.exception.ExceptionPayload;
import com.basketball_camps.exception.NotFoundApiException;
import com.basketball_camps.model.Camp;
import com.basketball_camps.model.CampRegistration;
import com.basketball_camps.model.User;
import com.basketball_camps.model.School;
import com.basketball_camps.repository.CampRegistrationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CampRegistrationService extends BasicServiceOperations<CampRegistrationRepository, CampRegistration> {

    private final CampService campService;
    private final UserService userService;
    private final SchoolService schoolService;

    public CampRegistrationService(CampRegistrationRepository repository, CampService campService,
            UserService userService, SchoolService schoolService) {
        super(repository);
        this.campService = campService;
        this.userService = userService;
        this.schoolService = schoolService;
    }

    @Transactional
    public CampRegistration registerParticipant(Long campId, Long userId, Long schoolId,
            String specialRequests, JerseySize jerseySize) {

        Camp camp = campService.findById(campId);
        if (camp == null) {
            throw new NotFoundApiException("Camp not found with id: " + campId, HttpStatus.NOT_FOUND);
        }

        User user = userService.findById(userId);
        if (user == null) {
            throw new NotFoundApiException("User not found with id: " + userId, HttpStatus.NOT_FOUND);
        }

        School school = schoolService.findById(schoolId);
        if (school == null) {
            throw new NotFoundApiException("School not found with id: " + schoolId, HttpStatus.NOT_FOUND);
        }

        validateRegistration(camp, user);

        CampRegistration registration = new CampRegistration();
        registration.setCamp(camp);
        registration.setUser(user);
        registration.setSchool(school);
        registration.setRegisteredAt(LocalDateTime.now());
        registration.setSpecialRequests(specialRequests);
        registration.setJerseySize(jerseySize);
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

    public List<CampRegistration> findByCampId(Long campId) {
        return repository.findByCampId(campId);
    }

    public List<CampRegistration> findByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    public Optional<CampRegistration> findByCampIdAndUserId(Long campId, Long userId) {
        return repository.findByCampIdAndUserId(campId, userId);
    }

    public List<CampRegistration> findByStatus(RegistrationStatus status) {
        return repository.findByStatus(status);
    }

    // public int countByCampIdAndStatus(Long campId, RegistrationStatus status) {
    // return repository.countByCampIdAndStatus(campId, status);
    // }

    private void validateRegistration(Camp camp, User user) {
        if (!camp.isRegistrationOpen()) {
            ExceptionPayload payload = ExceptionPayload.builder()
                    .message("Registration is closed for this camp")
                    .code("REGISTRATION_CLOSED")
                    .build();
            throw new EntityValidationException(payload);
        }

        if (isAlreadyRegistered(camp.getId(), user.getId())) {
            ExceptionPayload payload = ExceptionPayload.builder()
                    .message("User already registered for this camp")
                    .code("ALREADY_REGISTERED")
                    .build();
            throw new EntityValidationException(payload);
        }
    }

    private boolean isAlreadyRegistered(Long campId, Long userId) {
        return repository.findByCampIdAndUserId(campId, userId).isPresent();
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