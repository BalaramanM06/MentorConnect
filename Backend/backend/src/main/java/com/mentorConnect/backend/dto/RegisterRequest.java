package com.mentorConnect.backend.dto;

import java.util.Set;

import lombok.Data;

@Data
public class RegisterRequest {

    private String email;
    private String password;
    private Set<String> roles;
}
