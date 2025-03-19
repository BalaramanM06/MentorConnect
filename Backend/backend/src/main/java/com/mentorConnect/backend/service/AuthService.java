package com.mentorConnect.backend.service;


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

    

    public AuthenticationResponse register(User request){
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUserNam(request.getUserNam());

        user =userRepo.save(user);

        String token = jwtUtil.generateAccessToken(user);

        return new AuthenticationResponse(token);
    }

    public ResponseEntity<String> login(User user){
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        } catch (Exception e) {
            System.out.println("Exception: "+e);

        }
        String token =jwtUtil.generateAccessToken(user);
        return ResponseEntity.ok(token);
    }

    public AuthenticationResponse authenticate(User request){
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())   
        );

        User user = userRepo.findByEmail(request.getEmail()).get();
        String token = jwtUtil.generateAccessToken(user);
        return new AuthenticationResponse(token);
    }
}
