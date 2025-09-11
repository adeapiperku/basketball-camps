package com.basketball_camps.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basketball_camps.model.Participant;
import com.basketball_camps.payload.LoginPayload;
import com.basketball_camps.service.ParticipantService;

@RestController
@RequestMapping("/participants")
public class ParticipantController extends BasicControllerOperations<ParticipantService, Participant> {

    public ParticipantController(ParticipantService service) {
        super(service);
    }

    @PostMapping("/login")
    public Participant login(@RequestBody @Validated LoginPayload login) {
        return this.service.login(login.getEmail(), login.getPassword());
    }
}
