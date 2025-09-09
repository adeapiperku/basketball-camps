package com.basketball_camps.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Admin extends UserAccount {

   @Transient
   private String type = "Admin";

}