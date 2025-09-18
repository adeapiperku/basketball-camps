package com.basketball_camps.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basketball_camps.model.CampRegistration;
import com.basketball_camps.payload.RegistrationRequest;
import com.basketball_camps.service.CampRegistrationService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/registrations")
public class CampRegistrationController {
    
    private final CampRegistrationService registrationService;

    public CampRegistrationController(CampRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/register")
    public ResponseEntity<CampRegistration> register(@RequestBody @Valid RegistrationRequest request) {
        CampRegistration registration = registrationService.registerParticipant(
            request.getCampId(), 
            request.getParticipantId(),
            request.getSpecialRequests()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(registration);
    }
    
    @GetMapping("/camp/{campId}")
    public ResponseEntity<List<CampRegistration>> getCampRegistrations(@PathVariable Long campId) {
        List<CampRegistration> registrations = registrationService.findByCampId(campId);
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<CampRegistration>> getParticipantRegistrations(@PathVariable Long participantId) {
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