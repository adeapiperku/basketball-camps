package com.basketball_camps.controller;

import com.basketball_camps.dto.user.AuthenticationRequest;
import com.basketball_camps.dto.user.AuthenticationResponse;
import com.basketball_camps.dto.user.RegisterRequest;
import com.basketball_camps.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@Log4j2
@RequestMapping("/users")
@Controller
@RestController
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    // @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<AuthenticationResponse> createUser(
            @RequestBody RegisterRequest request) throws IOException {
        return ResponseEntity.ok(userService.createUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(userService.authentication(request));
    }
}
