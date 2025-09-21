package com.basketball_camps.payload;

import com.basketball_camps.model.UserAccount;
import lombok.Data;

@Data
public class JwtAuthenticationResponse {

    private String accessToken;
    private String refreshToken;
    private UserAccount user;
    private String expirationTime;

    public JwtAuthenticationResponse(UserAccount user, String accessToken, String refreshToken, String expirationTime) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
        this.expirationTime = expirationTime;
    }

}
