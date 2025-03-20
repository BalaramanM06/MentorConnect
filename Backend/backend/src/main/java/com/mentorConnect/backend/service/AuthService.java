package com.mentorConnect.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mentorConnect.backend.entity.AuthenticationResponse;
import com.mentorConnect.backend.entity.User;
import com.mentorConnect.backend.repository.UserRepo;
import com.mentorConnect.backend.security.JwtUtil;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthenticationResponse register(User request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUserNam(request.getUserNam());

        user = userRepo.save(user);

        String token = jwtUtil.generateAccessToken(user);

        return new AuthenticationResponse(token);
    }

    public ResponseEntity<String> login(User user) {
        try {
            // Authenticate the user
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );
    
            // Retrieve the user from the repository
            User foundUser = userRepo.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
    
            // Validate the role
            if (!foundUser.getRole().equals(user.getRole())) {
                return ResponseEntity.status(403).body("Invalid role");
            }
    
            // Generate the token
            String token = jwtUtil.generateAccessToken(foundUser);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            System.out.println("Exception: " + e);
            return ResponseEntity.status(401).body("Authentication failed");
        }
    }

    public AuthenticationResponse authenticate(User request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepo.findByEmail(request.getEmail()).get();
        String token = jwtUtil.generateAccessToken(user);
        return new AuthenticationResponse(token);
    }

    public User getUserByEmail(String email) {
        Optional<User> userOptional = userRepo.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Don't send password back to client
            user.setPassword(null);
            return user;
        }
        return null;
    }
}
