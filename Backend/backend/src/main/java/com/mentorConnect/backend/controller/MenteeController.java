package com.mentorConnect.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentorConnect.backend.entity.OldAndNewCourse;
import com.mentorConnect.backend.entity.UserAndCourse;
import com.mentorConnect.backend.service.MenteeService;

@RestController
@RequestMapping("/mentee")
public class MenteeController {
        @Autowired
        private MenteeService menteeService;

        @GetMapping("/getOldCourse")
        public ResponseEntity<List<UserAndCourse>> getOldCourse(String email){
            return ResponseEntity.ok(menteeService.getOldCourse(email));
        }

        @GetMapping("/getNewCourse")
        public ResponseEntity<List<UserAndCourse>> getNewCourse(String email){
            return ResponseEntity.ok(menteeService.getNewCourse(email));
        }

        @GetMapping("/getPendingRequest")
        public ResponseEntity<List<UserAndCourse>> getPendingRequest(String email){
            return ResponseEntity.ok(menteeService.getPendingRequest(email));
        }

        @GetMapping("/getMenteeCourseDetail")
        public ResponseEntity<OldAndNewCourse> getMenteeCourseDetail(String email){
            return ResponseEntity.ok(menteeService.getMenteeCourseDetail(email));
        }

        @GetMapping("/getAllCourse")
        public ResponseEntity<List<UserAndCourse>> getAllCourse(){
            return ResponseEntity.ok(menteeService.getAllCourse());
        }

        @GetMapping("/addRequest")
        public ResponseEntity<Void> addRequest(String menteeEmail,UserAndCourse userAndCourse){
            menteeService.addRequest(menteeEmail,userAndCourse);
            return ResponseEntity.ok().build();
        }
}
