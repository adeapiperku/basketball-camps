package com.basketball_camps.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class CampCoach extends UserAccount {

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "camp_id", nullable = false)
   private Camp camp;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "coach_id", nullable = false)
   private Coach coach;
}