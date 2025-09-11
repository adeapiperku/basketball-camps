package com.basketball_camps.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basketball_camps.model.Coach;
import com.basketball_camps.payload.LoginPayload;
import com.basketball_camps.service.CoachService;

@RestController
@RequestMapping("/coaches")
public class CoachController extends BasicControllerOperations<CoachService, Coach> {

    public CoachController(CoachService service) {
        super(service);
    }

    @PostMapping("/login")
    public Coach login(@RequestBody @Validated LoginPayload login) {
        return this.service.login(login.getEmail(), login.getPassword());
    }
}
