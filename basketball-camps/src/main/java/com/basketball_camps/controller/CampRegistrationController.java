package com.basketball_camps.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.basketball_camps.model.CampRegistration;
import com.basketball_camps.payload.RegistrationRequest;
import com.basketball_camps.service.CampRegistrationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/registrations")
public class CampRegistrationController {

    private final CampRegistrationService registrationService;

    public CampRegistrationController(CampRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/register")
    public ResponseEntity<CampRegistration> registerForCamp(@RequestBody @Valid RegistrationRequest request) {
        CampRegistration registration = registrationService.registerParticipant(
                request.getCampId(),
                request.getParticipantId(),
                request.getSchoolId(),
                request.getSpecialRequests(),
                request.getJerseySize().toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(registration);
    }

    @GetMapping("/camp/{campId}")
    public ResponseEntity<?> getRegistrationsByCamp(@PathVariable Long campId) {
        try {
            log.info("Fetching registrations for camp ID: {}", campId);
            if (campId == null) {
                log.error("Camp ID is null");
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Camp ID cannot be null"));
            }
            
            List<CampRegistration> registrations = registrationService.findByCampId(campId);
            if (registrations == null) {
                log.warn("No registrations found for camp ID: {}", campId);
                return ResponseEntity.ok(Collections.emptyList());
            }
            
            log.info("Successfully retrieved {} registrations for camp ID: {}", registrations.size(), campId);
            return ResponseEntity.ok(registrations);
            
        } catch (Exception e) {
            log.error("Error fetching registrations for camp ID: " + campId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", 
                    "Failed to fetch registrations: " + e.getMessage() + 
                    ". Please check the logs for more details."));
        }
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<CampRegistration>> getRegistrationsByParticipant(@PathVariable Long participantId) {
        List<CampRegistration> registrations = registrationService.findByParticipantId(participantId);
        return ResponseEntity.ok(registrations);
    }

    @PostMapping("/{registrationId}/confirm")
    public ResponseEntity<Void> confirmRegistration(@PathVariable Long registrationId) {
        registrationService.confirmRegistration(registrationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{registrationId}/cancel")
    public ResponseEntity<Void> cancelRegistration(@PathVariable Long registrationId) {
        registrationService.cancelRegistration(registrationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{registrationId}")
    public ResponseEntity<CampRegistration> getRegistration(@PathVariable Long registrationId) {
        CampRegistration registration = registrationService.findById(registrationId);
        if (registration != null) {
            return ResponseEntity.ok(registration);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}