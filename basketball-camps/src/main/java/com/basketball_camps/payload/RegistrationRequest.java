package com.basketball_camps.payload;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationRequest {
    @NotNull
    private Long campId;
    
    @NotNull
    private Long participantId;
    
    private String specialRequests;
}
