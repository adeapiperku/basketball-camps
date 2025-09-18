package com.basketball_camps.model;

import com.basketball_camps.enums.JerseySize;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Participant extends UserAccount {

    @Transient
    private String type = "Participant";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @Column
    private String emergencyContactPhone;

    @Column(columnDefinition = "TEXT")
    private String medicalNotes;

    @Enumerated(EnumType.STRING)
    private JerseySize jerseySize;

}