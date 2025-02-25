package com.mentorConnect.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentorConnect.backend.dto.RegisterRequest;
import com.mentorConnect.backend.entity.User;
import com.mentorConnect.backend.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest){
        return authService.register(registerRequest);
    }

    @GetMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user){
        return authService.login(user);
    }
}
