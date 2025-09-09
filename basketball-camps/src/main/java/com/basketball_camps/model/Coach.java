package com.basketball_camps.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Coach extends UserAccount {

   @Transient
   private String type = "Coach";

   @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
   private List<Camp> camps = new ArrayList<>();

   // @Column(columnDefinition = "TEXT")
   // private String information;

}