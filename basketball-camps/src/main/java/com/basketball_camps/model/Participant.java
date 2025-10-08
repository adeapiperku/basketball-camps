package com.basketball_camps.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Participant extends UserAccount {

    @Column(nullable = false, updatable = false)
    private final String type = "Participant";

    @Column
    private String emergencyContactPhone;

}