package com.basketball_camps.security.jwt;

import com.basketball_camps.model.Coach;
import com.basketball_camps.model.Participant;
import com.basketball_camps.model.User;
import com.basketball_camps.repository.CoachRepository;
import com.basketball_camps.repository.ParticipantRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Service
public class JwtService {

    private final ParticipantRepository participantRepository;
    private final CoachRepository coachRepository;
    @Value("${jwt.secret}")
    private String secret;

    public JwtService(ParticipantRepository participantRepository, CoachRepository coachRepository) {
        this.participantRepository = participantRepository;
        this.coachRepository = coachRepository;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String generateToken(User userDetails){
        return generateToken(new HashMap<>(),userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, User userDetails){
        if(userDetails.getRole().getName().equalsIgnoreCase("participant")){
            Optional<Participant> participant = participantRepository.findByEmail(userDetails.getEmail());
            participant.ifPresent(value -> extraClaims.put("userId", value.getId()));
        }
        if(userDetails.getRole().getName().equalsIgnoreCase("coach")){
            Optional<Coach> coach = coachRepository.findByEmail(userDetails.getEmail());
            coach.ifPresent(value -> extraClaims.put("userId", value.getId()));
        }
        if(userDetails.getRole().getName().equals("ADMIN")){
            extraClaims.put("userId",userDetails.getId());
        }
        extraClaims.put("email",userDetails.getEmail());
        extraClaims.put("firstName",userDetails.getFirstName());
        extraClaims.put("role",userDetails.getRole().getName());

        return Jwts
                .builder()
                .setClaims(extraClaims)
                .claim("authorities", userDetails.getAuthorities())
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    private Key getSignInKey() {
        byte[] keyBytes= Decoders.BASE64.decode(secret);

        return Keys.hmacShaKeyFor(keyBytes);
    }
    public <T> T extractClaim(String token , Function<Claims,T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver
                .apply(claims);
    }
    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
