package com.basketball_camps.controller.authentication;

import com.basketball_camps.model.UserAccount;
import com.basketball_camps.payload.JwtAuthenticationResponse;
import com.basketball_camps.payload.LoginPayload;
import com.basketball_camps.payload.RefreshTokenPayload;
import com.basketball_camps.repository.AdminRepository;
import com.basketball_camps.security.jwt.JwtTokenProvider;
import com.basketball_camps.service.authentication.UserDetailsServiceImpl;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
@Log4j2
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    AdminRepository userRepository;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginPayload loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(authentication);
            String expirationTime = tokenProvider.getFormattedExpirationTimeFromToken(jwt);

            return ResponseEntity.ok(new JwtAuthenticationResponse((UserAccount) authentication.getPrincipal(), jwt,
                    refreshToken, expirationTime));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenPayload refreshTokenPayload) {
        String refreshToken = refreshTokenPayload.getRefreshToken();
        if (tokenProvider.validateToken(refreshToken)) {
            String username = tokenProvider.getUserFromToken(refreshToken);
            UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);

            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());
            String newAccessToken = tokenProvider.generateToken(authentication);

            String expirationTime = tokenProvider.getFormattedExpirationTimeFromToken(newAccessToken);

            return ResponseEntity.ok(new JwtAuthenticationResponse((UserAccount) userDetails, newAccessToken,
                    refreshToken, expirationTime));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }

}
