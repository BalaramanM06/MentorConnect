package com.mentorConnect.backend.security;

import java.sql.Date;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mentorConnect.backend.entity.Role;
import com.mentorConnect.backend.entity.User;
import com.mentorConnect.backend.repository.UserRepo;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final SecretKey secretKeys=Keys.secretKeyFor(SignatureAlgorithm.HS512);

    private final int jwtExpirationMs=86400000;

    @Autowired
    private UserRepo userRepo;

    public String generateToken(String email) {
        Optional<User> user = userRepo.findByEmail(email);
        Set<Role> roles = user.get().getRole();
    
        return Jwts.builder()
                .setSubject(email)
                .claim("roles", roles.stream()
                                     .map(Role::getName)
                                     .collect(Collectors.joining(",")))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(secretKeys)
                .compact();
    }

    public String extractUsername(String token){
        return Jwts.parserBuilder().setSigningKey(secretKeys).build().parseClaimsJws(token).getBody().getSubject();
    }

    public Set<String> extractRoles(String token){
        String rolesString= Jwts.parserBuilder().setSigningKey(secretKeys).build().parseClaimsJws(token).getBody().get("roles",String.class);
    
        return Set.of(rolesString);
    }

    public boolean isTokenValid(String token){
        try{
            Jwts.parserBuilder().setSigningKey(secretKeys).build().parseClaimsJws(token);
            return true;

        }catch (JwtException |IllegalArgumentException e){
            return false;
        }
    }
}
