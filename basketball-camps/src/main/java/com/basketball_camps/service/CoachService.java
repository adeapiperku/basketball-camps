package com.basketball_camps.service;

import com.basketball_camps.dto.user.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.basketball_camps.exception.EntityValidationException;
import com.basketball_camps.exception.ExceptionPayload;
import com.basketball_camps.model.Coach;
import com.basketball_camps.repository.CoachRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CoachService extends BasicServiceOperations<CoachRepository, Coach> {

    private final PasswordEncoder passwordEncoder;
    private final CoachRepository coachRepository;

    public CoachService(CoachRepository repository, PasswordEncoder passwordEncoder, CoachRepository coachRepository) {
        super(repository);
        this.passwordEncoder = passwordEncoder;
        this.coachRepository = coachRepository;
    }

    @Override
    public Coach save(Coach entity) {
        boolean isNew = (entity.getId() == null);

        if (isNew) {
            entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        } else {
            Coach user = repository.findById(entity.getId())
                    .orElseThrow(() -> new EntityNotFoundException("No entity found with id: " + entity.getId()));
            if (!passwordEncoder.matches(entity.getPassword(), user.getPassword())) {
                entity.setPassword(passwordEncoder.encode(entity.getPassword()));
            } else {
                entity.setPassword(user.getPassword());
            }
        }
        Coach savedCoach = super.save(entity);
        return savedCoach;
    }

    @Override
    protected void validateEntity(Coach entity) throws EntityValidationException {
        Coach existingCoach = repository.findByEmail(entity.getEmail()).orElse(null);

        if (existingCoach != null && !existingCoach.getId().equals(entity.getId())) {
            throw new EntityValidationException(ExceptionPayload.builder()
                    .code("DuplicateEmail")
                    .fieldName("email")
                    .rejectedValue(entity.getEmail())
                    .message("This email already exists")
                    .build());
        }
    }

    public Coach login(String email, String password) {
        Coach coach = this.repository.findByEmail(email)
                .orElseThrow(() -> new EntityValidationException(ExceptionPayload.builder()
                        .code("WrongEmail")
                        .fieldName("email")
                        .rejectedValue(email)
                        .message("Wrong email")
                        .build()));
        if (!coach.getPassword().matches(password)) {
            throw new EntityValidationException(ExceptionPayload.builder()
                    .code("WrongPassword")
                    .fieldName("password")
                    .rejectedValue(password)
                    .message("Wrong password")
                    .build());
        }
        return coach;
    }

    public void createCoach (RegisterRequest request) {
        Coach coach = new Coach();
        if (request != null) {
            coach.setEmail(request.getEmail());
            coach.setFirstName(request.getFirstName());
            coach.setLastName(request.getLastName());
            coach.setPhoneNumber(request.getPhoneNumber());
            coach.setBirthDate(request.getBirthDate());

            coachRepository.save(coach);
        }
    }
}