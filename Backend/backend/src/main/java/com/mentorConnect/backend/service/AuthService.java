package com.mentorConnect.backend.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mentorConnect.backend.dto.RegisterRequest;
import com.mentorConnect.backend.entity.Role;
import com.mentorConnect.backend.entity.User;
import com.mentorConnect.backend.repository.RoleRepo;
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
    @Autowired
    private RoleRepo roleRepo;

    public  ResponseEntity<String> register(RegisterRequest registerRequest){
        if(userRepo.findByEmail(registerRequest.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User newUser=new User();
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        Set<Role> roles=new HashSet<>();
        for(String role:registerRequest.getRoles()){
            Role r=roleRepo.findByName(role).orElseThrow(()-> new RuntimeException("Role not found "+ role));
            roles.add(r);
        }
        newUser.setRole(roles);
        userRepo.save(newUser);
        return ResponseEntity.ok("User created successfully");
        
    }

    public ResponseEntity<String> login(User user){
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        } catch (Exception e) {
            System.out.println("Exception: "+e);
        }
        String token =jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(token);
    }
}
