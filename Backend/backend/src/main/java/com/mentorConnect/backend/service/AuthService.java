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

    public AuthenticationResponse login(User user) {
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        } catch (Exception e) {
            System.out.println("Exception: " + e);
            throw e;
        }

        // Get the actual user from database to ensure we have all fields
        Optional<User> userOptional = userRepo.findByEmail(user.getEmail());
        if (userOptional.isPresent()) {
            User authenticatedUser = userOptional.get();
            String token = jwtUtil.generateAccessToken(authenticatedUser);
            AuthenticationResponse response = new AuthenticationResponse(token);
            response.setRole(authenticatedUser.getRole());
            return response;
        }

        throw new RuntimeException("User not found");
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
