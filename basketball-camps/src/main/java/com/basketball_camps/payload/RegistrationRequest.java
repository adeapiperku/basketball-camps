package com.basketball_camps.payload;

import com.basketball_camps.enums.JerseySize;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationRequest {
    @NotNull
    private Long campId;
    
    @NotNull
    private Long participantId;
    
    private String specialRequests;
    private JerseySize jerseySize;
}
