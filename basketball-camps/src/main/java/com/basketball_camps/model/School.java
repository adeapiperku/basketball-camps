package com.basketball_camps.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class School extends BaseEntity {

    @NotEmpty
    @Column(nullable = false, unique = true)
    private String name;

}