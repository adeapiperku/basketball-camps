package com.basketball_camps.payload;

import com.basketball_camps.enums.JerseySize;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class RegistrationRequest {
    @NotNull(message = "Camp ID is required")
    private Long campId;
    
    @NotNull(message = "Participant ID is required")
    private Long participantId;
    
    @NotNull(message = "School ID is required")
    private Long schoolId;
    
    private String specialRequests;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private JerseySize jerseySize;
}
