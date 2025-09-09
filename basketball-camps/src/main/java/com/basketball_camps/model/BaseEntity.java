package com.basketball_camps.model;

import java.time.LocalDateTime;

import com.basketball_camps.validation.group.Update;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Data
@MappedSuperclass
public abstract class BaseEntity {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @NotNull(groups = Update.class)
   private Long id;

   @CreatedDate
   @Column(updatable = false)
   private LocalDateTime createdOn;

   @LastModifiedDate
   private LocalDateTime updatedOn;

}