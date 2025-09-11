package com.basketball_camps.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.basketball_camps.exception.EntityValidationException;
import com.basketball_camps.exception.ExceptionPayload;
import com.basketball_camps.model.Participant;
import com.basketball_camps.repository.ParticipantRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ParticipantService extends BasicServiceOperations<ParticipantRepository, Participant> {

    private final PasswordEncoder passwordEncoder;

    public ParticipantService(ParticipantRepository repository, PasswordEncoder passwordEncoder) {
        super(repository);
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Participant save(Participant entity) {
        boolean isNew = (entity.getId() == null);

        if (isNew) {
            entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        } else {
            Participant user = repository.findById(entity.getId())
                    .orElseThrow(() -> new EntityNotFoundException("No entity found with id: " + entity.getId()));
            if (!passwordEncoder.matches(entity.getPassword(), user.getPassword())) {
                entity.setPassword(passwordEncoder.encode(entity.getPassword()));
            } else {
                entity.setPassword(user.getPassword());
            }
        }
        Participant savedParticipant = super.save(entity);
        return savedParticipant;
    }

    @Override
    protected void validateEntity(Participant entity) throws EntityValidationException {
        Participant existingParticipant = repository.findByEmail(entity.getEmail()).orElse(null);

        if (existingParticipant != null && !existingParticipant.getId().equals(entity.getId())) {
            throw new EntityValidationException(ExceptionPayload.builder()
                    .code("DuplicateEmail")
                    .fieldName("email")
                    .rejectedValue(entity.getEmail())
                    .message("This email already exists")
                    .build());
        }
    }

    public Participant login(String email, String password) {
        Participant participant = this.repository.findByEmail(email)
                .orElseThrow(() -> new EntityValidationException(ExceptionPayload.builder()
                        .code("WrongEmail")
                        .fieldName("email")
                        .rejectedValue(email)
                        .message("Wrong email")
                        .build()));
        if (!participant.getPassword().matches(password)) {
            throw new EntityValidationException(ExceptionPayload.builder()
                    .code("WrongPassword")
                    .fieldName("password")
                    .rejectedValue(password)
                    .message("Wrong password")
                    .build());
        }
        return participant;
    }

}