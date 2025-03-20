package com.mentorConnect.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mentorConnect.backend.entity.OldAndNewMentee;
import com.mentorConnect.backend.entity.UserAndCourse;
import com.mentorConnect.backend.security.JwtUtil;
import com.mentorConnect.backend.service.MentorService;

@RestController
@RequestMapping("/mentor")
public class MentorConntroller {

    @Autowired
    private MentorService mentorService;

    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/validateCertificate")
    public ResponseEntity<?> validateCertificate(@RequestParam("certificate") MultipartFile certificate,
            @RequestParam("mentorName") String mentorName,
            @RequestParam("courseName") String courseName,
            @RequestHeader("Authorization") String token,
            @RequestParam("description") String description) {
        return mentorService.validateCertificate(certificate, mentorName, courseName,token,description);
    }

    @GetMapping("/getAllPastUser")
    public ResponseEntity<List<UserAndCourse>> getAllPastUser(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(mentorService.getAllPastUser(extractEmail(token)));
    }

    @GetMapping("/getAllCurrUser")
    public ResponseEntity<List<UserAndCourse>> getAllCurrUser(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(mentorService.getAllCurrUser(extractEmail(token)));
    }

    @GetMapping("/getAllPendingRequest")
    public ResponseEntity<List<UserAndCourse>> getAllPendingRequest(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(mentorService.getAllPendingRequest(extractEmail(token)));
    }

    @GetMapping("/getAllStudent")
    public ResponseEntity<OldAndNewMentee> getAllStudent(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(mentorService.getAllStudent(extractEmail(token)));
    }

    @PostMapping("/removeAndToPast")
    public ResponseEntity<?> removeAndToPast(@RequestHeader("Authorization") String token,
                                             @RequestParam("menteeEmail") String menteeEmail,
                                             @RequestParam("courseName") String courseName) {
        return mentorService.removeAndToPast(extractEmail(token), menteeEmail, courseName);
    }

    

    public String extractEmail(String token) {
        token = token.substring("Bearer ".length());
        return jwtUtil.extractEmail(token);
    }
}
