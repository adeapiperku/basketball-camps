package com.basketball_camps.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

// import java.util.HashSet;
// import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Coach extends UserAccount {

   @Transient
   private String type = "Coach";

   // @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL, orphanRemoval = true)
   // private Set<CampCoach> campCoaches = new HashSet<>();

   // @Column(columnDefinition = "TEXT")
   // private String information;

}