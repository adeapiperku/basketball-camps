package com.basketball_camps.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginPayload {

   @Email
   private String email;

   @NotBlank
   private String password;
}
