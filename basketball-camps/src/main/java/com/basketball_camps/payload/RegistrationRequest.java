package com.basketball_camps.payload;

import com.basketball_camps.enums.JerseySize;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationRequest {
    @NotNull(message = "Camp ID is required")
    private Long campId;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "School ID is required")
    private Long schoolId;
    
    private String specialRequests;
    private JerseySize jerseySize;
}
