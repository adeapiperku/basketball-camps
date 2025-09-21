package com.basketball_camps.service.authentication;

import com.basketball_camps.model.Admin;
import com.basketball_camps.model.Coach;
import com.basketball_camps.model.Participant;
import com.basketball_camps.model.UserAccount;
import com.basketball_camps.repository.AdminRepository;
import com.basketball_camps.repository.CoachRepository;
import com.basketball_camps.repository.ParticipantRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private ParticipantRepository participantRepository;
    @Autowired
    private CoachRepository coachRepository;

    @Override
    public UserAccount loadUserByUsername(String email) throws UsernameNotFoundException {
        // First check if it's an admin
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return admin.get();
        }

        // Then check if it's a coach
        Optional<Coach> coach = coachRepository.findByEmail(email);
        if (coach.isPresent()) {
            return coach.get();
        }

        // Finally, check if it's a participant
        Optional<Participant> participant = participantRepository.findByEmail(email);
        if (participant.isPresent()) {
            return participant.get();
        }

        // If none are found, throw an exception
        throw new UsernameNotFoundException("User with email '" + email + "' not found!");
    }

    public UserAccount loadUserById(Long id) {
        // Check if it's an admin by ID
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isPresent()) {
            return admin.get();
        }

        // Check if it's a participant by ID
        Optional<Participant> participant = participantRepository.findById(id);
        if (participant.isPresent()) {
            return participant.get();
        }

        // Check if it's a coach by ID
        Optional<Coach> coach = coachRepository.findById(id);
        if (coach.isPresent()) {
            return coach.get();
        }

        // If no user is found, throw an exception
        throw new UsernameNotFoundException("User not found with id : " + id);
    }

}