package com.basketball_camps.service;

import com.basketball_camps.dto.user.AuthenticationRequest;
import com.basketball_camps.dto.user.AuthenticationResponse;
import com.basketball_camps.dto.user.RegisterRequest;
import com.basketball_camps.enums.Status;
import com.basketball_camps.exception.UserAlreadyExistsException;
import com.basketball_camps.repository.RoleRepository;
import com.basketball_camps.repository.UserRepository;
import com.basketball_camps.security.jwt.JwtService;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ParticipantService participantService;
    private final CoachService coachService;

    public AuthenticationResponse authentication(AuthenticationRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder().token(jwtToken).userId(user.getId()).build();
    }

    public AuthenticationResponse createUser(RegisterRequest request) throws  IOException {
        validateRegisterRequest(request);

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("A user with this email already exists: " + request.getEmail());
        }

        var user = com.basketball_camps.model.User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(roleRepository.findByName(request.getRole()))
                .phoneNumber(request.getPhoneNumber())
                .birthDate(request.getBirthDate())
                .status(Status.ACTIVE)
                .build();

        userRepository.save(user);

        if(request.getRole().equalsIgnoreCase("participant")){
            participantService.createParticipant(request);
        }
        if(request.getRole().equalsIgnoreCase("coach")){
            coachService.createCoach(request);
        }

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .build();
    }
    private void validateRegisterRequest(RegisterRequest request) {
        if (request.getFirstName() == null || request.getFirstName().isEmpty() ||
                request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new ValidationException("Please fill the required  fields");
        }
    }

}
